"use server";

import { NextRequest, NextResponse } from "next/server";
import { fetchGitHubResume } from "@/lib/github";
import { prisma } from "@/lib/prisma";
import { getUserIdFromSession } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;
    const userId = await getUserIdFromSession();

    if (!username || !userId) {
      return NextResponse.json(
        { error: "Unauthorized or username missing" },
        { status: 400 }
      );
    }

    const resume = await fetchGitHubResume(username);

    if (resume) {
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          githubUsername: username,
        },
      });
    }
    const githubSave = await prisma.gitHubProfile.upsert({
      where: { userId },
      update: {
        username,
        lastFetched: new Date(),
        // replace old skills with new ones
        skills: {
          deleteMany: {},
          create: resume.skills.map((cat: any) => ({
            name: cat.name,
            skills: {
              create: cat.skills.map((s: any) => ({ name: s.name })),
            },
          })),
        },
        // replace old projects with new ones
        projects: {
          deleteMany: {},
          create: resume.projects.map((p: any) => ({
            title: p.title,
            role: p.role || "",
            startDate: new Date(p.startDate),
            endDate: p.endDate ? new Date(p.endDate) : null,
            current: !!p.current,
            link: p.link || "",
            description: p.description || "",
          })),
        },
        // replace or update personal info
        personalInfo: {
          upsert: {
            update: {
              fullName: resume.personalInfo.fullName || "",
              email: resume.personalInfo.email || "",
              phone: resume.personalInfo.phone || "",
              address: resume.personalInfo.address || null,
              linkedin: resume.personalInfo.linkedin || null,
              github: resume.personalInfo.github || null,
              website: resume.personalInfo.website || null,
              summary: resume.personalInfo.summary || "",
              jobTitle: resume.personalInfo.jobTitle || "",
            },
            create: {
              fullName: resume.personalInfo.fullName || "",
              email: resume.personalInfo.email || "",
              phone: resume.personalInfo.phone || "",
              address: resume.personalInfo.address || null,
              linkedin: resume.personalInfo.linkedin || null,
              github: resume.personalInfo.github || null,
              website: resume.personalInfo.website || null,
              summary: resume.personalInfo.summary || "",
              jobTitle: resume.personalInfo.jobTitle || "",
            },
          },
        },
      },
      create: {
        userId,
        username,
        lastFetched: new Date(),
        skills: {
          create: resume.skills.map((cat: any) => ({
            name: cat.name,
            skills: {
              create: cat.skills.map((s: any) => ({ name: s.name })),
            },
          })),
        },
        projects: {
          create: resume.projects.map((p: any) => ({
            title: p.title,
            role: p.role || "",
            startDate: new Date(p.startDate),
            endDate: p.endDate ? new Date(p.endDate) : null,
            current: !!p.current,
            link: p.link || "",
            description: p.description || "",
          })),
        },
        personalInfo: {
          create: {
            fullName: resume.personalInfo.fullName || "",
            email: resume.personalInfo.email || "",
            phone: resume.personalInfo.phone || "",
            address: resume.personalInfo.address || null,
            linkedin: resume.personalInfo.linkedin || null,
            github: resume.personalInfo.github || null,
            website: resume.personalInfo.website || null,
            summary: resume.personalInfo.summary || "",
            jobTitle: resume.personalInfo.jobTitle || "",
          },
        },
      },
    });

    return NextResponse.json({ success: true, githubSave });
  } catch (err: any) {
    console.error("GitHub resume fetch error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;
    const userId = await getUserIdFromSession();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        githubUsername: null,
      },
    });

    await prisma.gitHubProfile.deleteMany({
      where: {
        userId,
        username,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("GitHub disconnect error:", err);
    return NextResponse.json(
      { error: "Failed to disconnect GitHub" },
      { status: 500 }
    );
  }
}
