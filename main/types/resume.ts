import { ResumeSection } from "@/components/resume/section-reorder";
export type Message = {
  id: string;
  type: "user" | "ai";
  content: string|React.ReactNode;
  timestamp: Date;
  isTyping?: boolean;
}

export type SkillCategory = {
  id?:string;
  name: string;
  skills: Skill[];
};
export type Skill = {
  name: string;
};
export type resume = {
  id: string;
  title: string;
  views: number;
  downloads: number;
  shares: number;
  template: string;
  updatedAt: Date;
};

  export type ResumeData = {
    id: string;
    personalInfo: PersonalInfo | null;
    experiences: Experiences[];
    projects: Projects[];
    education: Education[];
    skills: SkillCategory[];
    customSections: CustomSections[];
    sectionOrder: ResumeSection[];
    template: string;
    slug?: string;
  };

  export type EntryType = {
    id: string;
    title: string | null;
    description: string | null;
    date: string | null;
    link: string | null;
  };

  export type PersonalInfo = {
    fullName: string;
    email: string;
    jobTitle: string; // Optional: Prisma supports it
    phone: string;
    linkedin: string | null;
    github: string | null;
    website: string | null;
    address: string | null;
    summary: string; // Optional: included in Prisma
  };

  export type Experiences = {
    id?:string
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    location?: string;
    description?: string;
  };
  export type Projects = {
    id?:string;
    title: string;
    role?: string;
    link?:string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description: string;
  };

  export type Education = {
    institution: string;
    current: boolean;
    degree: string;
    description: string | null;
    startDate: string;
    endDate?: string;
    location?: string;
  };

  export type CustomSections = {
    id: string;
    title: string;
    entries: EntryType[];
  };

export type TemplateProps = {
  personal: PersonalInfo;
  experiences: Experiences[];
  projects: Projects[];
  skills: SkillCategory[];
  education: Education[];
  custom: CustomSections[];
  sectionOrder: ResumeSection[];
};

export type CoverLetterTemplateProps={
  jobTitle:string;
  fullName:string;
  template:string;
  companyName:string;
  content:string;
  email:string;
  title:string;
  phone:string;
  preferences:string;
  hiringManager?:string;
}
export type SectionType =
  | "personal"
  | "experience"
  | "project"
  | "education"
  | "skills"
  | "template"
  | "custom"
  | "reorder";

  export interface Template {
  id: string
  name: string
  description: string
  categories: string[]
  thumbnail: string
}


export interface CoverLetterProps {
  fullName: string
  title:string
  email: string
  phone: string
  companyName: string
  jobTitle: string
  hiringManager?: string
  preferences: string
  content: string
  template: string
}
export interface CoverLetter{
  id:string
  title:string
  updatedAt:Date
  fullName: string
  email: string
  phone: string
  companyName: string
  jobTitle: string
  hiringManager?: string
  preferences: string
  content:string
  template: string
}

export interface DownloadCoverLetterParams {
  contentRef: React.RefObject<HTMLElement | null>;
  title: string;
  onStart?: () => void;
  onSuccess?: () => void;
  onError?: () => void;
}