import { ResumeData } from "@/types/resume";

const DEFAULT_SECTION_ORDER = [
  { title: "Personal Information", type: "core", isActive: true },
  { title: "Experience", type: "core", isActive: true },
  { title: "Projects", type: "core", isActive: true },
  { title: "Education", type: "core", isActive: true },
  { title: "Skills", type: "core", isActive: true },
  { title: "Custom Sections", type: "custom", isActive: true },
];

function formatMonthYear(dateString: string | undefined): string {
  if (!dateString) return "";
  try {
    return new Date(dateString).toISOString().slice(0, 7);
  } catch {
    return "";
  }
}

export function initializeResumeState(
  id: string,
  fetchedData: any, 
  githubProfile: any,
  selectedTemplate: string | null
): ResumeData {
  const storageKey = `resumeData-${id}`;
  const savedData = sessionStorage.getItem(storageKey);
  if (savedData) {
    try {
      const parsedData = JSON.parse(savedData) as ResumeData;
      return parsedData;
    } catch (e) {
      console.error("Failed to parse saved resume data from sessionStorage:", e);
      sessionStorage.removeItem(storageKey);
    }
  }

    const data = fetchedData as ResumeData; 

  const mergedPersonalInfo = {
    fullName: data.personalInfo?.fullName || "John Doe",
    email: data.personalInfo?.email || githubProfile?.personalInfo?.email || "youremail@gmail.com",
    jobTitle: data.personalInfo?.jobTitle || "Software Engineer",
    phone: data.personalInfo?.phone || "8989898989",
    linkedin: data.personalInfo?.linkedin || "https://linkedin.in",
    github: data.personalInfo?.github || githubProfile?.personalInfo?.github || "",
    website: data.personalInfo?.website || githubProfile?.personalInfo?.website || "hello",
    address: data.personalInfo?.address || githubProfile?.personalInfo?.address || "",
    summary: data.personalInfo?.summary || "Your professional summary here.",
  };

  const mapExperience = (exp: any) => ({
    ...exp,
    startDate: formatMonthYear(exp.startDate),
    endDate: formatMonthYear(exp.endDate),
  });

  const finalData: ResumeData = {
    id: id,
    slug: data.slug,
    title: data.title,
    template: selectedTemplate || data.template || "default-template-id", // Ensure template has a fallback
    personalInfo: mergedPersonalInfo,
    
    // Process Arrays and apply date formatting
    experiences: data.experiences?.map(mapExperience) ?? [],
    projects: data.projects?.map(mapExperience) ?? (githubProfile?.projects?.map(mapExperience) ?? []),
    education: data.education?.map((edu: any) => ({
        ...edu,
        description: edu.description || "",
        startDate: formatMonthYear(edu.startDate),
        endDate: formatMonthYear(edu.endDate),
    })) ?? [],
    skills: data.skills || githubProfile?.skills || [],
    customSections: data.customSections ?? [],
    
    // Section Order
    sectionOrder:
      (data.sectionOrder && data.sectionOrder.length > 0)
        ? data.sectionOrder
        : DEFAULT_SECTION_ORDER,
  };

  return finalData;
}