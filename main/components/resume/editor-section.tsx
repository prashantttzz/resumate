"use client"

import { useState, useEffect } from "react"
import { PersonalInfoForm } from "@/components/resume/forms/personal-info-form"
import { ExperienceForm } from "@/components/resume/forms/experience-form"
import { EducationForm } from "@/components/resume/forms/education-form"
import { SkillsForm } from "@/components/resume/forms/skills-form"
import { ResumeData, SectionType } from "@/types/resume"
import { ProjectForm } from "./forms/project-form"

interface EditorSectionsProps {
  activeSection: SectionType
  resumeData: ResumeData
  data:ResumeData
  onSectionComplete: (section: SectionType, data: any) => void
}

export function EditorSections({ activeSection, resumeData, onSectionComplete ,data}: EditorSectionsProps) {
  const data_personal = data.personalInfo;
  const [personalData, setPersonalData] = useState(resumeData.personalInfo ||{})
  const [experienceData, setExperienceData] = useState(resumeData.experiences || [])
  const [projectData, setProjectData] = useState(resumeData.projects || [])
  const [educationData, setEducationData] = useState(resumeData.education || [])
  const [skillsData, setSkillsData] = useState(resumeData.skills || [])
  useEffect(() => {
    setPersonalData(resumeData.personalInfo || data_personal||{})
    setExperienceData(resumeData.experiences || [])
    setProjectData(resumeData.projects || [])
    setEducationData(resumeData.education || [])
    setSkillsData(resumeData.skills || [])
  }, [resumeData])

  // Handle personal info submission
  const handlePersonalSubmit = (data: any) => {
    setPersonalData(data)
    onSectionComplete("personal", data)
  }

  // Handle experience submission
  const handleExperienceSubmit = (data: any[]) => {
    setExperienceData(data)
    onSectionComplete("experience", data)
  }
  const handleProjectSubmit = (data: any[]) => {
    setProjectData(data)
    onSectionComplete("project", data)
  }

  // Handle education submission
  const handleEducationSubmit = (data: any[]) => {
    setEducationData(data)
    onSectionComplete("education", data)
  }

  // Handle skills submission
  const handleSkillsSubmit = (data: any[]) => {
    setSkillsData(data)
    onSectionComplete("skills", data)
  }
  return (
    <div className="animate-in">
      {activeSection === "personal" && (
        <div>
          <h3 className="text-lg font-medium mb-4">Personal Information</h3>
          <PersonalInfoForm defaultValues={personalData} onSubmit={handlePersonalSubmit} />
        </div>
      )}

      {activeSection === "experience" && (
        <div>
          <h3 className="text-lg font-medium mb-4">Work Experience</h3>
          <ExperienceForm defaultValues={experienceData} onSubmit={handleExperienceSubmit} />
        </div>
      )}
      {activeSection === "project" && (
        <div>
          <h3 className="text-lg font-medium mb-4">Projects</h3>
          <ProjectForm defaultValues={projectData} onSubmit={handleProjectSubmit} />
        </div>
      )}

      {activeSection === "education" && (
        <div>
          <h3 className="text-lg font-medium mb-4">Education</h3>
          <EducationForm defaultValues={educationData} onSubmit={handleEducationSubmit} />
        </div>
      )}

      {activeSection === "skills" && (
        <div>
          <h3 className="text-lg font-medium mb-4">Skills</h3>
          <SkillsForm
            defaultValues={skillsData}
            onSubmit={handleSkillsSubmit}
          />
        </div>
      )}
    </div>
  )
}
