import { notFound } from "next/navigation";
import { ModernTemplate } from "@/components/templates/modern-template";
import { templateMap } from "@/components/templates/template-map";
import React from "react";
import { getresumeBySlug } from "@/actions/resume-actions";
import { isWatermark } from "@/actions/user-actions";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  return { title: `Resume | ${params.slug}` };
}

export default async function ResumeServerPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug;
  const resumeData = await getresumeBySlug(slug);
  const showWaterMark = await isWatermark(slug);
  if (!resumeData) {
    notFound();
  }
  const personal = resumeData.personalInfo!;
  const experiences = resumeData.experiences.map((exp: any) => ({
    ...exp,
    location: exp.location ?? undefined,
    description: exp.description ?? undefined,
    startDate: new Date(exp.startDate).toISOString(),
    endDate: exp.endDate ? new Date(exp.endDate).toISOString() : undefined,
  }));
  const projects = resumeData.projects.map((project: any) => ({
    ...project,
    role: project.role ?? undefined,
    link: project.link ?? undefined,
    startDate: new Date(project.startDate).toISOString(),
    endDate: project.endDate
      ? new Date(project.endDate).toISOString()
      : undefined,
  }));
  const education = resumeData.education.map((edu: any) => ({
    ...edu,
    location: edu.location ?? undefined,
    startDate: new Date(edu.startDate).toISOString(),
    endDate: edu.endDate ? new Date(edu.endDate).toISOString() : undefined,
  }));

  const Template = templateMap[resumeData.template] || ModernTemplate;

  return (
    <div className="w-full h-full md:flex items-center justify-center ">
      <div className=" bg-white w-[800px] relative" id="resume">
        <Template
          personal={personal}
          projects={projects}
          education={education}
          experiences={experiences}
          sectionOrder={resumeData.sectionOrder}
          skills={resumeData.skills}
          custom={resumeData.customSections}
        />
        {showWaterMark && (
          <div className="absolute bottom-2 left-0 flex items-center justify-center text-xs text-gray-400 w-full ">
            Made with Resumate
          </div>
        )}{" "}
      </div>
    </div>
  );
}
