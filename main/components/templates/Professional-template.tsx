import { EntryType, TemplateProps } from "@/types/resume";
import React from "react";

const ProffesionalTemplate = ({
  personal,
  education,
  experiences,
  projects,
  skills,
  custom,
  sectionOrder,
}: TemplateProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };
  return (
    <div className="p-6 print:p-0 font-serif leading-tight">
      <header className="w-full font-serif flex flex-col items-center justify-center text-black">
        <h1 className="text-3xl font-serif mb-1">{personal.fullName}</h1>
        <div className="flex gap-2 font-light text-gray-500 font-serif text-xs">
          {personal.email && <span>{personal.email}</span>}|
          {personal.phone && <span>{personal.phone}</span>}|
          {personal.website && (
            <a
              href={personal.website}
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              portfolio
            </a>
          )}
          |
          {personal.linkedin && (
            <a
              href={personal.linkedin}
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              LinkedIn
            </a>
          )}
          {personal.github && (
            <a
              href={personal.github}
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              GitHub
            </a>
          )}
        </div>
      </header>
      {/* Dynamic Sections */}
      {sectionOrder.map((section) => {
        if (!section.isActive) return null;

        switch (section.title) {
          case "Personal Information":
            return (
              personal.summary && (
                <section className="pt-3 page-section">
                  <h2 className="text-lg font-serif text-gray-800 mb-1 border-b border-black">
                    Professional Summary
                  </h2>
                  <p className="text-gray-600 font-extralight text-sm leading-snug font-serif">
                    {personal.summary}
                  </p>
                </section>
              )
            );
          case "Experience":
            return (
              experiences.length > 0 && (
                <section key={section.title} className="pt-3">
                  <h2 className="text-lg font-serif text-gray-800 mb-2 border-b border-black">
                    Work Experience
                  </h2>
                  <div className="space-y-2">
                    {experiences.map((exp, idx) => (
                      <div key={idx} className="pl-2 page-section">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-base font-serif text-black ">{exp.position}</h3>
                            <p className="text-gray-900 font-serif italic text-xs">
                              {exp.company} {exp.location && `• ${exp.location}`}
                            </p>
                          </div>
                          <span className="text-xs text-gray-700 whitespace-nowrap font-serif">
                            {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate || "")}
                          </span>
                        </div>
                        {exp.description && (
                          <ul className="mt-1 text-gray-700 text-sm space-y-0.5">
                            {exp.description
                              .split("\n")
                              .filter((line) => line.trim())
                              .map((line, i) => (
                                <li key={i} className="flex">
                                  <span className="mr-1 text-black">•</span>
                                  {line}
                                </li>
                              ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )
            );

          case "Education":
            return (
              education.length > 0 && (
                <section key={section.title} className="pt-3 page-section">
                  <h2 className="text-lg font-serif text-gray-800 mb-2 border-b border-black">
                    Education
                  </h2>
                  <div className="space-y-2">
                    {education.map((edu, idx) => (
                      <div key={idx} className="pl-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-sm text-gray-900">{edu.degree}</h3>
                            <p className="text-gray-700 text-xs italic">
                              {edu.institution} {edu.location && `• ${edu.location}`}
                            </p>
                          </div>
                          <span className="text-xs text-gray-700 whitespace-nowrap">
                            {formatDate(edu.startDate)} - {edu.current ? "Present" : formatDate(edu.endDate!)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )
            );

          case "Projects":
            return (
              projects.length > 0 && (
                <section key={section.title} className="pt-3">
                  <h2 className="text-lg font-serif text-gray-800 mb-2 border-b border-black">
                    Projects
                  </h2>
                  <div className="grid grid-cols-1 gap-2">
                    {projects.map((prj, idx) => (
                      <div key={idx} className="pl-2 page-section">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-base font-serif text-black">{prj.role}</h3>
                            <p className="text-gray-900 font-serif italic text-sm">{prj.title}</p>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-xs text-gray-700 whitespace-nowrap font-serif">
                              {formatDate(prj.startDate)} - {prj.current ? "Present" : formatDate(prj.endDate || "")}
                            </span>
                            {prj.link && <span className="text-gray-700 underline italic text-xs">{prj.link}</span>}
                          </div>
                        </div>
                        {prj.description && (
                          <ul className="mt-1 text-gray-700 text-sm space-y-0.5">
                            {prj.description
                              .split("\n")
                              .filter((line) => line.trim())
                              .map((line, i) => (
                                <li key={i} className="flex">
                                  <span className="mr-1 text-black">•</span>
                                  {line}
                                </li>
                              ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )
            );

          case "Skills":
            return (
              skills.length > 0 && (
                <section key={section.title} className="pt-3">
                  <h2 className="text-lg text-gray-800 mb-2 border-b border-black">Skills</h2>
                  <div>
                    {skills.map((category, catIdx) => (
                      <div key={catIdx} className="page-section flex gap-1">
                        <h3 className="text-sm font-semibold text-gray-800">{category.name}:</h3>
                        <div className="flex flex-wrap gap-1 items-center">
                          {category.skills.map((skill, skillIdx) => (
                            <p key={skillIdx} className="text-gray-800 text-xs">{skill.name},</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )
            );

          case "Custom Sections":
            return (
              custom.length > 0 && (
                <div key={section.title}>
                  {custom.map(
                    (customSection) =>
                      customSection.entries.length > 0 && (
                        <section key={customSection.id} className="pt-3 page-section">
                          <h2 className="text-lg text-gray-800 mb-2 border-b border-black">
                            {customSection.title}
                          </h2>
                          <div className="space-y-2">
                            {customSection.entries.map((entry: EntryType) => (
                              <div key={entry.id} className="pl-2 page-section">
                                <div className="flex justify-between items-start">
                                  <h3 className="text-sm italic text-gray-900">{entry.title}</h3>
                                  {entry.date && <span className="text-xs text-gray-500">{entry.date}</span>}
                                </div>
                                {entry.description && (
                                  <ul className="mt-0.5 text-gray-700 text-xs space-y-0.5">
                                    {entry.description
                                      .split("\n")
                                      .filter((line: any) => line.trim())
                                      .map((line: any, i: number) => (
                                        <li key={i} className="flex">
                                          <span className="mr-1 text-gray-600">•</span>
                                          {line}
                                        </li>
                                      ))}
                                  </ul>
                                )}
                                {entry.link && (
                                  <a
                                    href={entry.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-gray-600 underline text-xs mt-0.5 inline-block"
                                  >
                                    {entry.link}
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        </section>
                      )
                  )}
                </div>
              )
            );

          default:
            return null;
        }
      })}
    </div>
  );
};

export default ProffesionalTemplate;
