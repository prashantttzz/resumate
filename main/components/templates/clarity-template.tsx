import { EntryType, TemplateProps } from "@/types/resume";

export function SidebarTemplate({
  personal,
  education,
  experiences,
  projects,
  skills,
  custom,
  sectionOrder,
}: TemplateProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <>
      <div className="p-6 print:p-0">
        <div className=" text-zinc-800  print-wrapper resume-container relative">
          <div className=" origin-top-left w-[125%] md:w-full h-[125%] md:h-full flex">
            {/* Left Sidebar */}
            <aside className="w-[250px] bg-gray-100  p-10 md:p-6 flex flex-col items-center space-y-4">
              <h1 className="text-3xl font-semibold text-center">{personal.fullName}</h1>
              <p className="text-sm font-medium text-gray-600 text-center">
                {personal.jobTitle}
              </p>

              <div className="border-t border-gray-300 w-full pt-4 space-y-2">
                {personal.email && (
                  <p className="text-xs break-words">{personal.email}</p>
                )}
                {personal.phone && <p className="text-xs">{personal.phone}</p>}
                {personal.website && (
                  <p className="text-xs break-words flex gap-2">
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
                      Website
                    </a>
                  </p>
                )}
                {personal.linkedin && (
                  <p className="text-xs break-words flex gap-2">
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
                  <p className="text-xs break-words flex gap-2">
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
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                      <path d="M9 18c-4.51 2-5-2-7-2" />
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
                {personal.address && (
                  <p className="text-xs mt-2">{personal.address}</p>
                )}
              </div>

              {personal.summary && (
                <section className="mt-6 text-sm text-gray-700">
                  <h2 className="font-semibold mb-1 border-b border-gray-300 pb-1 uppercase">
                    Summary
                  </h2>
                  <p>{personal.summary}</p>
                </section>
              )}

              {skills.length > 0 && (
                <section className="mt-auto w-full">
                  <h2 className="font-semibold mb-2 uppercase border-b border-gray-300 pb-1 text-sm">
                    Skills
                  </h2>
                  {skills.map((cat, idx) => (
                    <div key={idx} className="mb-3 page-section">
                      <h3 className="font-semibold text-xs">{cat.name}</h3>
                      <ul className="list-disc list-inside text-xs space-y-0.5">
                        {cat.skills.map((skill, sidx) => (
                          <li key={sidx}>
                            {skill.name}{" "}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </section>
              )}
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 space-y-8 overflow-y-auto">
              {sectionOrder.map((section) => {
                if (!section.isActive) return null;

                switch (section.title) {
                  case "Experience":
                    return (
                      <section key={section.title} className="">
                        <h2 className="text-2xl font-bold border-b border-gray-300 pb-2 mb-4">
                          {section.title}
                        </h2>
                        {experiences.map((exp, idx) => (
                          <div key={idx} className="mb-6 page-section">
                            <div className="flex justify-between text-sm font-semibold text-gray-700 mb-1">
                              <span>{exp.company}</span>
                              <span>
                                {formatDate(exp.startDate)} -{" "}
                                {exp.current
                                  ? "Present"
                                  : formatDate(exp.endDate || "")}
                              </span>
                            </div>
                            <p className="italic text-xs text-gray-600 mb-1">
                              {exp.position}
                            </p>
                            {exp.location && (
                              <p className="italic text-xs text-gray-600 mb-1">
                                {exp.location}
                              </p>
                            )}
                            <p className="text-sm">{exp.description}</p>
                          </div>
                        ))}
                      </section>
                    );

                  case "Projects":
                    return (
                      <section key={section.title} className="">
                        <h2 className="text-2xl font-bold border-b border-gray-300 pb-2 mb-4">
                          {section.title}
                        </h2>
                        {projects.map((proj, idx) => (
                          <div key={idx} className="mb-6 page-section">
                            <div className="flex justify-between text-sm font-semibold text-gray-700 mb-1">
                              <span>{proj.title}</span>
                              <span>
                                {formatDate(proj.startDate)} -{" "}
                                {proj.current
                                  ? "Present"
                                  : formatDate(proj.endDate || "")}
                              </span>
                            </div>
                            <p className="italic text-xs text-gray-600 mb-1">
                              {proj.role}
                            </p>
                            <p className="text-sm">{proj.description}</p>
                          </div>
                        ))}
                      </section>
                    );

                  case "Education":
                    return (
                      <section key={section.title} className="page-section">
                        <h2 className="text-2xl font-bold border-b border-gray-300 pb-2 mb-4">
                          {section.title}
                        </h2>
                        {education.map((edu, idx) => (
                          <div key={idx} className="mb-6">
                            <div className="flex justify-between text-sm font-semibold text-gray-700 mb-1">
                              <span>{edu.degree}</span>
                              <span>
                                {formatDate(edu.startDate)} -{" "}
                                {edu.current
                                  ? "Present"
                                  : formatDate(edu.endDate || "")}
                              </span>
                            </div>
                            <p className="italic text-xs text-gray-600 mb-1">
                              {edu.institution}
                            </p>
                            {edu.location && (
                              <p className="text-xs text-gray-600">{edu.location}</p>
                            )}
                            {edu.description && (
                              <p className="text-sm">{edu.description}</p>
                            )}
                          </div>
                        ))}
                      </section>
                    );

                  case "Custom Sections":
                    return custom.length > 0 ? (
                      <section key={section.title} className="">
                        <h2 className="text-2xl font-bold border-b border-gray-300 pb-2 mb-4">
                        </h2>
                        {custom.map((customSection) => (
                          <div key={customSection.id} className="mb-6 page-section">
                            <h4 className="font-semibold text-xl mb-2">
                              {customSection.title}
                            </h4>
                            {customSection.entries.map((entry: EntryType) => (
                              <div key={entry.id} className="mb-3">
                                <div className="flex justify-between text-sm font-semibold text-gray-700 mb-1">
                                  <span>{entry.title}</span>
                                  {entry.date && <span>{entry.date}</span>}
                                </div>
                                <p className="text-sm mb-1">{entry.description}</p>
                                {entry.link && (
                                  <a
                                    href={entry.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline text-sm"
                                  >
                                    View more
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        ))}
                      </section>
                    ) : null;

                  default:
                    return null;
                }
              })}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
