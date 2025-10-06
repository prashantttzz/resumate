"use server";

import { getUserIdFromSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ResumeData } from "@/types/resume";

export async function newResume(name: string) {
  const user = await getUserIdFromSession();
  if (!user) {
    throw new Error("unauthorized");
  }
  try {
    const PremiumUser = await prisma.user.findUnique({
      where: {
        id: user,
      },
      select: {
        isPremium: true,
      },
    });
    if (!PremiumUser) {
      throw new Error("user not found");
    }

    const resumeCount = await prisma.resume.count({
      where: {
        userId: user,
      },
    });
    if (!PremiumUser.isPremium && resumeCount >= 3) {
      throw new Error(
        "Free users can only create up to 3 resumes. Upgrade to premium for unlimited."
      );
    }

    const newResume = await prisma.resume.create({
      data: {
        userId: user,
        title: name,
      },
    });

    if (!newResume) {
      throw new Error("problem creating new resume");
    }
    return newResume.id;
  } catch (error: any) {
    console.error(error);
    throw new Error(error || "internal server error");
  }
}

export async function getResumeById(id: string) {
  const user = await getUserIdFromSession();
  if (!user) {
    throw new Error("unauthorized");
  }
  try {
    const resume = await prisma.resume.findFirst({
      where: {
        id,
      },
      include: {
        personalInfo: true,
        customSections: {
          include: {
            entries: true,
          },
        },
        sectionOrder: true,
        education: true,
        experiences: true,
        projects: true,
        skills: {
          include: {
            skills: true,
          },
        },
      },
    });
    if (!resume) {
      throw new Error("no resume found");
    }
    return resume;
  } catch (error) {
    console.error(error);
    throw new Error("internal server error");
  }
}

export async function saveResume(resume: ResumeData, resumeId: string) {
  const user = await getUserIdFromSession();
  if (!user) {
    throw new Error("unauthorized");
  }
  if (!resume || !resumeId) throw new Error("Invalid resume input");
  try {
    const url = process.env.NEXT_PUBLIC_BASE_URL!;
    const slug = `${url}preview/${resumeId}`;
    await prisma.resume.update({
      where: { id: resumeId },
      data: {
        slug: resume.slug || slug,
        template: resume.template,
        updatedAt: new Date(),

        personalInfo: {
          upsert: {
            update: {
              fullName: resume.personalInfo?.fullName,
              email: resume.personalInfo?.email,
              jobTitle: resume.personalInfo?.jobTitle,
              phone: resume.personalInfo?.phone,
              address: resume.personalInfo?.address,
              linkedin: resume.personalInfo?.linkedin, // Optional: fill from UI
              github: resume.personalInfo?.github,
              website: resume.personalInfo?.website,
              summary: resume.personalInfo?.summary,
            },
            create: {
              fullName: resume.personalInfo?.fullName || "",
              email: resume.personalInfo?.email || "",
              phone: resume.personalInfo?.phone || "",
              address: resume.personalInfo?.address || "",
              summary: resume.personalInfo?.summary || "",
              jobTitle: resume.personalInfo?.jobTitle || "",
              linkedin: resume.personalInfo?.linkedin || "", // Optional: fill from UI
              github: resume.personalInfo?.github || "",
              website: resume.personalInfo?.website || "",
            },
          },
        },
        experiences: {
          deleteMany: {},
          create: resume.experiences.map((exp) => ({
            company: exp.company,
            position: exp.position,
            startDate: new Date(exp.startDate),
            endDate: exp.current
              ? null
              : exp.endDate
              ? new Date(exp.endDate)
              : null,
            current: exp.current,
            location: exp.location,
            description: exp.description,
          })),
        },
        projects: {
          deleteMany: {},
          create: resume.projects.map((project) => ({
            title: project.title,
            role: project.role,
            startDate: new Date(project.startDate),
            endDate: project.current
              ? null
              : project.endDate
              ? new Date(project.endDate)
              : null,
            current: project.current,
            link: project.link,
            description: project.description,
          })),
        },
        education: {
          deleteMany: {},
          create: resume.education.map((edu) => ({
            institution: edu.institution,
            degree: edu.degree,
            startDate: new Date(edu.startDate),
            endDate: edu.current
              ? null
              : edu.endDate
              ? new Date(edu.endDate)
              : null,
            current: edu.current,
            description: edu.description,
            location: edu.location,
          })),
        },
        skills: {
          deleteMany: {},
          create: resume.skills.map((skill) => ({
            name: skill.name,
            skills: {
              create: skill.skills.map((s) => ({
                name: s.name,
              })),
            },
          })),
        },
        customSections: {
          deleteMany: {}, // wipe all existing custom sections + entries

          create: resume.customSections.map((section) => ({
            title: section.title,
            entries: {
              create: section.entries.map((entry) => ({
                title: entry.title || "",
                description: entry.description,
                date: entry.date || null,
                link: entry.link || null,
              })),
            },
          })),
        },
        sectionOrder: {
          deleteMany: {},
          create: resume.sectionOrder.map((order, index) => ({
            order: index,
            title: order.title,
            isActive: order.isActive,
            type: order.type,
          })),
        },
      },
    });

    return { success: true };
  } catch (err: any) {
    console.error("💥 Resume save failed:", err);
    throw new Error(err);
  }
}
export async function deleteResume(id: string) {
  const userId = await getUserIdFromSession();
  if (!userId) throw new Error("User not logged in");
  if (!id) throw new Error("Resume ID is required");

  try {
    // Optional: make sure the resume belongs to the user
    const resume = await prisma.resume.delete({
      where: { id },
    });

    // Return the deleted resume for confirmation
    return resume;
  } catch (error: any) {
    // Better error message
    throw new Error(error?.message || "Failed to delete resume");
  }
}

export async function getAllResume() {
  const user = await getUserIdFromSession();
  if (!user) {
    throw new Error("unauthorized");
  }
  try {
    const userId = user;
    const all = await prisma.resume.findMany({
      where: {
        userId,
      },
    });
    if (all.length < 0 || !all) {
      throw new Error("no resume found for this user");
    }
    return all;
  } catch (error) {
    console.error(error);
    throw new Error("internal server errror");
  }
}

export async function setSlug({ url, id }: { url: string; id: string }) {
  const user = await getUserIdFromSession();
  if (!user) {
    throw new Error("unauthorized");
  }
  try {
    console.log("url", url);
    const set = await prisma.resume.update({
      where: {
        id,
      },
      data: {
        slug: url,
      },
    });
    console.log("set", set);
    if (!set) {
      throw new Error("error updating url");
    }
    return { success: true };
  } catch (error: any) {
    console.log("someting went wrong!", error.message);
    throw new Error("internal server error");
  }
}

export async function getresumeBySlug(url: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
  const completeUrl = `${baseUrl}preview/${url}`;
  try {
    if (!url) {
      throw new Error("no url found");
    }
    const update = await prisma.resume.findFirst({
      where: {
        slug: completeUrl,
      },
      include: {
        personalInfo: true,
        customSections: {
          include: {
            entries: true,
          },
        },
        sectionOrder: true,
        education: true,
        experiences: true,
        projects: true,
        skills: {
          include: {
            skills: true,
          },
        },
      },
    });
    if (!update) {
      throw new Error("no resume found by this url");
    }
    return update;
  } catch (error: any) {
    console.log("something went wrong");
    throw new Error(error.message);
  }
}

export async function changeResumeName({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  try {
    const user = await getUserIdFromSession();
    if (!user) {
      throw new Error("unauthorized");
    }
    const resume = await prisma.resume.update({
      where: { id },
      data: {
        title,
      },
    });
    return { sucess: true };
  } catch (error: any) {
    console.log("something went wrong");
    throw new Error(error.message);
  }
}

export async function updateViewCount(url: string) {
  try {
    const userId = await getUserIdFromSession();
    if (!url) {
      throw new Error("not url found");
    }
    if (userId) {
      const sameUser = await prisma.resume.findUnique({
        where: {
          userId: userId,
          slug: url,
        },
      });
      if (sameUser) {
        return { success: false };
      }
    }
    const resume = await prisma.resume.update({
      where: {
        slug: url,
      },
      data: {
        views: { increment: 1 },
      },
    });
    return { success: true };
  } catch (error: any) {
    console.error(error.message || "internal server error");
    return { success: false };
  }
}

export async function resumeCount() {
  try {
    const user = await getUserIdFromSession();
    if (!user) {
      throw new Error("user not authorized");
    }
    const PremiumUser = await prisma.user.findUnique({
      where: {
        id: user,
      },
      select: {
        isPremium: true,
      },
    });
    if (PremiumUser?.isPremium) {
      return null;
    }
    const resumeCount = await prisma.resume.count({
      where: {
        userId: user,
      },
    });
    return resumeCount;
  } catch (error: any) {
    console.error(error.message);
    throw new Error(error.message);
  }
}
