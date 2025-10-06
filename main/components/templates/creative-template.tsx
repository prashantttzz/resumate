import { EntryType, TemplateProps } from "@/types/resume";

export function CreativeTemplate({
  personal,
  education,
  experiences,
  skills,
  custom,
  projects,
  sectionOrder,
}: TemplateProps) {
  // Format date function
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  // Filter sections for sidebar and main content
  const sidebarSections = ["Personal Infomation", "Skills", "Education"];
  const mainSections = ["Experience", "Custom Sections", "Projects"];
  return (
    <>
      <div className="p-6 print:p-0 text-zinc-800  min-h-[1123px]  relative">
        <div className="grid grid-cols-3 gap-2">
          <div className=" bg-zinc-100 p-6 px-2 h-full">
            <header className="mb-8">
              <h1 className="text-lg font-bold mb-1">{personal.fullName}</h1>
              <h2 className="text-sm text-zinc-600 mb-4">
                {personal.jobTitle}
              </h2>

              <div className="space-y-2 text-[11px]">
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-zinc-500"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <span className=" ">{personal.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-zinc-500"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>{personal.phone}</span>
                </div>
                {personal.address && (
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-zinc-500"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>{personal.address}</span>
                  </div>
                )}
                {personal.website && (
                  <p className="text-[11px] break-words flex gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-zinc-500"
                    >
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                    <a
                      href={personal.website}
                      target="_blank"
                      rel="noreferrer"
                      className="underline hover:text-blue-600"
                    >
                      {personal.website}
                    </a>
                  </p>
                )}
                {personal.linkedin && (
                  <p className="text-[11px] break-words flex gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-zinc-500"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect width="4" height="12" x="2" y="9" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                    <a
                      href={personal.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="underline hover:text-blue-600"
                    >
                      LinkedIn
                    </a>
                  </p>
                )}
                {personal.github && (
                  <p className="text-[11px] break-words flex gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-zinc-500"
                    >
                      <path
                        d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 
    5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 
    5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 
    6.44 7A3.37 3.37 0 0 0 9 20.13V24"
                      />
                    </svg>

                    <a
                      href={personal.github}
                      target="_blank"
                      rel="noreferrer"
                      className="underline hover:text-blue-600"
                    >
                      Github
                    </a>
                  </p>
                )}
              </div>
            </header>

            {/* Render sidebar sections based on order */}
            {sectionOrder
              .filter(
                (section) =>
                  section.isActive && sidebarSections.includes(section.title)
              )
              .map((section) => {
                switch (section.title) {
                  case "Skills":
                    return (
                      <section key={section.title} className="mb-6">
                        <h3 className="text-sm font-bold mb-3 border-b border-zinc-300 pb-1">
                          Skills
                        </h3>

                        {skills.map((category, categoryIndex) => (
                          <div
                            key={categoryIndex}
                            className={
                              categoryIndex < skills.length - 1 ? "mb-4 page-section" : ""
                            }
                          >
                            <h4 className="text-xs font-medium mb-2">
                              {category.name}
                            </h4>
                            <div className="space-y-1">
                              {category.skills.map(
                                (skill: any, skillIndex: number) => (
                                  <div
                                    key={skillIndex}
                                    className="flex items-center justify-between pl-1 w-full"
                                  >
                                    <span className="text-[11px]">{skill.name}</span>
                                    
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        ))}
                      </section>
                    );
                  case "Education":
                    return (
                      <section key={section.title} className="mb-5 page-section">
                        <h3 className="text-sm font-bold mb-3 border-b border-zinc-300 pb-1">
                          Education
                        </h3>

                        {education.map((edu, index) => (
                          <div key={index}>
                            <h4 className="text-xs font-medium">{edu.degree}</h4>
                            <h5 className="text-[11px] text-zinc-600 mb-1">
                              {edu.institution}
                            </h5>
                            <p className="text-[11px] text-zinc-600 mb-2">
                              {formatDate(edu.startDate)} -{" "}
                              {edu.current ? "present" : formatDate(edu.endDate!)}
                            </p>
                            {edu.description && (
                              <p className="text-[11px]">{edu.description}</p>
                            )}
                          </div>
                        ))}
                      </section>
                    );
                  default:
                    return null;
                }
              })}
          </div>

          <div className="col-span-2 p-6">
            <section className="mb-6">
              <h3 className="text-base font-bold mb-3 border-b border-zinc-300 pb-1">
                Summary
              </h3>
              <p className="text-xs">{personal.summary}</p>
            </section>

            {/* Render main content sections based on order */}
            {sectionOrder
              .filter(
                (section) =>
                  section.isActive && mainSections.includes(section.title)
              )
              .map((section) => {
                switch (section.title) {
                  case "Experience":
                    return (
                      <section key={section.title} className="mb-6 ">
                        <h3 className="text-base font-bold mb-3 border-b border-zinc-300 pb-1">
                          Experience
                        </h3>

                        {experiences.map((experience, index) => (
                          <div
                            key={index}
                            className={
                              index < experiences.length - 1 ? "mb-5 page-section" : ""
                            }
                          >
                            <div className="flex justify-between items-baseline mb-1">
                              <h4 className="text-sm font-medium">
                                {experience.position}
                              </h4>
                              <span className="text-xs text-zinc-600">
                                {formatDate(experience.startDate)} -{" "}
                                {experience.current
                                  ? "Present"
                                  : formatDate(experience.endDate!)}
                              </span>
                            </div>
                            <h5 className="text-xs font-medium text-zinc-600 mb-2">
                              {experience.company}
                              {experience.location
                                ? `, ${experience.location}`
                                : ""}
                            </h5>
                            <p className="text-xs mb-2">
                              {experience.description}
                            </p>
                          </div>
                        ))}
                      </section>
                    );
                  case "Projects":
                    return (
                      <section key={section.title} className="mb-6">
                        <h3 className="text-base font-bold mb-3 border-b border-zinc-300 pb-1">
                          Projects
                        </h3>

                        {projects.map((project, index) => (
                          <div
                            key={index}
                            className={index < projects.length - 1 ? "mb-5 page-section" : ""}
                          >
                            <div className="flex justify-between items-baseline mb-1">
                              <h4 className="text-sm font-medium">
                                {project.title}
                              </h4>
                              <span className="text-xs text-zinc-600">
                                {formatDate(project.startDate)} -{" "}
                                {project.current
                                  ? "Present"
                                  : formatDate(project.endDate!)}
                              </span>
                            </div>
                            <h5 className="text-xs font-medium text-zinc-600 mb-2">
                              {project.role}
                            </h5>
                            <p className="text-xs mb-2">{project.description}</p>
                          </div>
                        ))}
                      </section>
                    );
                  case "Custom Sections":
                    return custom.length > 0 ? (
                      <div key={section.title}>
                        {custom.map((customSection) => (
                          <section
                            key={customSection.id}
                            className="mb-6  page-section "
                          >
                            <h3 className="text-base font-semibold border-b border-zinc-300 pb-1 mb-3">
                              {customSection.title}
                            </h3>
                            <div className="space-y-4">
                              {customSection.entries.map((entry: EntryType) => (
                                <div key={entry.id} className="mb-3">
                                  <div className="flex justify-between items-baseline mb-1">
                                    <h4 className="text-sm font-medium">
                                      {entry.title}
                                    </h4>
                                    {entry.date && (
                                      <span className="text-xs text-zinc-600">
                                        {entry.date}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs mt-1">
                                    {entry.description}
                                  </p>
                                  {entry.link && (
                                    <a
                                      href={entry.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline text-xs mt-1 inline-block"
                                    >
                                      View more
                                    </a>
                                  )}
                                </div>
                              ))}
                            </div>
                          </section>
                        ))}
                      </div>
                    ) : null;

                  default:
                    return null;
                }
              })}
          </div>
        </div>
      </div>
    </>
  );
}
