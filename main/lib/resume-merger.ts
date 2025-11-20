import { ResumeData } from "@/types/resume";
export function mergeResumeData(
  resumeData: any,
  githubData: any
): any | null {
  if (!resumeData) {
    return null;
  }

  const githubPersonalInfo = githubData?.personalInfo;
  const githubProjects = githubData?.projects ?? [];
  const githubSkills = githubData?.skills ?? [];

  const defaultPersonalInfo = {
    fullName: "John Doe",
    email: "johndoe@gmail.com",
    jobTitle: "Software Engineer",
    phone: "8989898989",
    linkedin: "https://linkedin.in",
    github: "",
    website: "",
    address: "",
    summary: "Your professional summary here.",
  };

  const defaultSectionOrder = [
    { title: "Personal Information", type: "core", isActive: true },
    { title: "Experience", type: "core", isActive: true },
    { title: "Projects", type: "core", isActive: true },
    { title: "Education", type: "core", isActive: true },
    { title: "Skills", type: "core", isActive: true },
    { title: "Custom Sections", type: "custom", isActive: true },
  ];

  const mergedData: ResumeData = {
    ...resumeData,

    personalInfo: {
      ...defaultPersonalInfo,
      ...(resumeData.personalInfo || githubPersonalInfo || {}),
    },

    projects:
      resumeData.projects && resumeData.projects.length > 0
        ? resumeData.projects
        : githubProjects,

    skills:
      resumeData.skills && resumeData.skills.length > 0
        ? resumeData.skills
        : githubSkills,

    experiences: resumeData.experiences ?? [],
    education: resumeData.education ?? [],

    sectionOrder:
      resumeData.sectionOrder && resumeData.sectionOrder.length > 0
        ? resumeData.sectionOrder
        : defaultSectionOrder,
  };

  return mergedData;
}
