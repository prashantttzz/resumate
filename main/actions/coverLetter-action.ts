"use server"
import { getUserIdFromSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CoverLetterProps } from "@/types/resume";

export async function newCoverLetter(name: string) {
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

    const coverLetterCount = await prisma.coverLetter.count({
      where: {
        userId: user,
      },
    });
    if (!PremiumUser.isPremium && coverLetterCount >= 3) {
      throw new Error(
        "Free users can only create up to 3 resumes. Upgrade to premium for unlimited."
      );
    }

    const newCoverLetter = await prisma.coverLetter.create({
      data: {
        userId: user,
        title: name,
        fullName: "john doe",
        phone: "9090909090",
        email: "johndoe@mail.com",
        jobTitle: "software engineer",
        companyName: "xyz enterprises",
        hiringManager:'',
        preferences: "friendly",
        template: "minimal",
        content: "null",
      },
    });

    if (!newCoverLetter) {
      throw new Error("problem creating new coverletter");
    }
    return newCoverLetter.id;
  } catch (error: any) {
    console.error(error);
    throw new Error(error || "internal server error");
  }
}

export async function getCoverLetterById(id: string) {
  try {
    const coverLetter = await prisma.coverLetter.findFirst({
      where: {
        id,
      },
    });
    
    if (!coverLetter) {
      throw new Error("no coverLetter found");
    }
    return coverLetter;
  } catch (error) {
    console.error(error);
    throw new Error("internal server error");
  }
}

export async function saveCoverLetter(
  coverLetter: CoverLetterProps,
  coverLetterId: string
) {
  const user = await getUserIdFromSession();
  if (!user) {
    throw new Error("unauthorized");
  }
  if (!coverLetter || !coverLetterId)
    throw new Error("Invalid coverLetter input");
  try {
    await prisma.coverLetter.update({
      where: { id: coverLetterId },
      data: {
        fullName: coverLetter.fullName,
        email: coverLetter.email,
        phone: coverLetter.phone,
        preferences: coverLetter.preferences,
        hiringManager: coverLetter.hiringManager,
        template: coverLetter.template,
        content: coverLetter.content,
        companyName: coverLetter.companyName,
        jobTitle: coverLetter.jobTitle,
        updatedAt:new Date()
      },
    });

    return { success: true };
  } catch (err: any) {
    console.error("💥 cover Letter save failed:", err);
    throw new Error(err);
  }
}

export async function getAllCoverLetter() {
  const user = await getUserIdFromSession();
  if (!user) {
    throw new Error("unauthorized");
  }
  try {
    const userId = user;
    const all = await prisma.coverLetter.findMany({
      where: {
        userId,
      },
    });
    if (all.length < 0 || !all) {
      throw new Error("no coverLetter found for this user");
    }
    return all;
  } catch (error) {
    console.error(error);
    throw new Error("internal server errror");
  }
}

export async function coverLetterCount() {
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
    const coverLetterCount = await prisma.coverLetter.count({
      where: {
        userId: user,
      },
    });
    return coverLetterCount;
  } catch (error: any) {
    console.error(error.message);
    throw new Error(error.message);
  }
}
