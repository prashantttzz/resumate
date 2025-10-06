"use server";
import { getUserIdFromSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TRACE_OUTPUT_VERSION } from "next/dist/shared/lib/constants";

export async function getIsPremium() {
  try {
    const userId = await getUserIdFromSession();
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isPremium: true, lastSubscriptionDate: true },
    });

    return {
      isPremium: user?.isPremium ?? false,
      expireDate: user?.lastSubscriptionDate,
    };
  } catch (error: any) {
    console.error("Error in getIsPremium:", error.message);
    return { isPremium: false };
  }
}
export async function getAllUser() {
  try {
    const allUser = await prisma.user.findMany();
    return allUser;
  } catch (error) {
    console.error("error fetching users");
  }
}
export async function isWatermark(slug: string) {
  try {
    const user = await prisma.resume.findUnique({
      where: { slug },
      select: {
        userId: true,
      },
    });
    const isPremium = await prisma.user.findUnique({
      where: { id: user?.userId },
      select: { isPremium: true },
    });
    return isPremium;
  } catch (error) {
    console.error("internal server error");
  }
}
export async function githubUsername() {
  try {
    const userId = await getUserIdFromSession();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const result = await prisma.user.findUnique({
      where: { id: userId },
      select: { githubUsername: true },
    });

    if (!result || !result.githubUsername) {
      return { success: false, error: "No GitHub username found" };
    }

    return { success: true, githubUsername: result.githubUsername };
  } catch (error) {
    console.error("Error fetching GitHub username:", error);
    return { success: false, error: "Internal server error" };
  }
}
export async function githubProfileResume() {
  try {
    const userId = await getUserIdFromSession();
    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const result = await prisma.gitHubProfile.findUnique({
      where: { userId },
      include: {
        personalInfo: true,   // relational PersonalInfo
        projects: true,       // relational Projects
        skills: {             // relational SkillCategory + nested Skills
          include: {
            skills: true,
          },
        },
      },
    });

    if (!result) {
      return { success: false, error: "No GitHub data found" };
    }

    // Prepare a pared response
    const parsedResponse = {
      personalInfo: result.personalInfo || null,
      projects: result.projects || [],
      skills: result.skills
    };

    return { success: true, data: parsedResponse };
  } catch (error) {
    console.error("Error fetching GitHub profile:", error);
    return { success: false, error: "Internal server error" };
  }
}
