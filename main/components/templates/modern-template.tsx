import { EntryType, TemplateProps } from "@/types/resume";

export function ModernTemplate({
  personal,
  education,
  experiences,
  projects,
  skills,
  custom,
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

  return (
    <>
      <div className="p-6 print:p-0 text-zinc-800 ">
        <header className="mb-6">
          <h1 className="text-3xl font-bold mb-1">{personal.fullName}</h1>
          <h2 className="text- text-zinc-600 mb-3">{personal.jobTitle}</h2>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-600">
            <div>{personal.email}</div>
            <div>{personal.phone}</div>
            {personal.address && <div>{personal.address}</div>}{" "}
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
          </div>
        </header>

        {/* Render sections based on order */}
        {sectionOrder.map((section) => {
          if (!section.isActive) return null;

          switch (section.title) {
            case "Personal Information":
              return (
                <section key={section.title} className="page-section">
                  <h3 className="text-lg font-semibold border-b border-zinc-300 pb-1 mb-3">
                    Summary
                  </h3>
                  <p className="text-sm">{personal.summary}</p>
                </section>
              );
            case "Experience":
              return (
                <section key={section.title} className="pt-6">
                  <h3 className="text-lg font-semibold border-b border-zinc-300 pb-1 mb-3">
                    Experience
                  </h3>

                  {experiences.map((experience, index) => (
                    <div
                      key={index}
                      className={
                        index < experiences.length - 1
                          ? "mb-5 page-section"
                          : "page-section"
                      }
                    >
                      <div className="flex justify-between items-baseline mb-1 ">
                        <h4 className="text-base font-medium">
                          {experience.company}
                        </h4>
                        <span className="text-sm text-zinc-600">
                          {formatDate(experience.startDate)} -{" "}
                          {experience.current
                            ? "Present"
                            : formatDate(experience.endDate || "")}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline mb-1">
                        <h5 className="text-sm font-medium text-zinc-600">
                          {experience.position}
                        </h5>
                        {experience.location && (
                          <span className="text-sm text-zinc-600">
                            {experience.location}
                          </span>
                        )}
                      </div>
                      {experience.description && (
                        <ul className="mt-2 list-disc pl-5 text-gray-700 text-sm space-y-1">
                          {experience.description
                            .split("\n")
                            .filter(Boolean)
                            .map((line, j) => (
                              <li key={j}>{line}</li>
                            ))}
                        </ul>
                      )}{" "}
                    </div>
                  ))}
                </section>
              );
            case "Projects":
              return (
                <section key={section.title} className="pt-6">
                  <h3 className="text-lg font-semibold border-b border-zinc-300 pb-1 mb-3">
                    Projects
                  </h3>

                  {projects.map((project, index) => (
                    <div
                      key={index}
                      className={
                        index < projects.length - 1
                          ? " mb-5 page-section"
                          : "page-section"
                      }
                    >
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className="text-base font-medium">{project.title}</h4>
                        <span className="text-sm text-zinc-600">
                          {formatDate(project.startDate)} -{" "}
                          {project.current
                            ? "Present"
                            : formatDate(project.endDate || "")}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline mb-1">
                        <h5 className="text-sm font-medium text-zinc-600">
                          {project.role}
                        </h5>
                        <h5 className="text-sm font-medium text-blue-600 cursor-pointer">
                          {project.link}
                        </h5>
                      </div>
                      {project.description && (
                        <ul className="mt-2 list-disc pl-5 text-gray-700 text-sm space-y-1">
                          {project.description
                            .split("\n")
                            .filter(Boolean)
                            .map((line, j) => (
                              <li key={j}>{line}</li>
                            ))}
                        </ul>
                      )}{" "}
                    </div>
                  ))}
                </section>
              );
            case "Education":
              return (
                <section key={section.title} className="pt-6">
                  <h3 className="text-lg font-semibold border-b border-zinc-300 pb-1 mb-3">
                    Education
                  </h3>

                  {education.map((edu, index) => (
                    <div key={index} className=" mb-5 page-section">
                      <div className="flex justify-between items-baseline ">
                        <h4 className="text-base font-medium">{edu.degree}</h4>
                        <span className="text-sm text-zinc-600">
                          {formatDate(edu.startDate)} -
                          {edu.current ? "present" : formatDate(edu.endDate!)}
                        </span>
                      </div>
                      <div className="flex justify-between items-baseline mb-1">
                        <h5 className="text-sm font-medium text-zinc-600">
                          {edu.institution}
                        </h5>
                        {edu.location && (
                          <span className="text-sm text-zinc-600">
                            {edu.location}
                          </span>
                        )}
                      </div>
                      {edu.description && (
                        <p className="text-sm mt-1">{edu.description}</p>
                      )}
                    </div>
                  ))}
                </section>
              );
            case "Skills":
              return (
                <section key={section.title} className="pt-6">
                  <h3 className="text-lg font-semibold border-b border-zinc-300 pb-1 mb-3">
                    Skills
                  </h3>

                  {skills.map((category, categoryIndex) => (
                    <div
                      key={categoryIndex}
                      className={
                        categoryIndex < skills.length - 1
                          ? "mb-2 page-section"
                          : "page-section"
                      }
                    >
                      <h4 className="text-sm font-medium mb-1">
                        {category.name}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {category.skills.map((skill: any, skillIndex: number) => (
                          <span
                            key={skillIndex}
                            className="text-xs bg-zinc-100 px-2 py-1 rounded"
                          >
                            {skill.name}
                          </span>
                        ))}
                      </div>
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
                      className="pt-6 page-section"
                    >
                      <h3 className="text-lg font-semibold border-b border-zinc-300 pb-1 mb-3">
                        {customSection.title}
                      </h3>
                      <div className="space-y-4">
                        {customSection.entries.map((entry: EntryType) => (
                          <div key={entry.id} className="mb-3 page-section">
                            <div className="flex justify-between items-baseline mb-1">
                              <h4 className="text-base font-medium">
                                {entry.title}
                              </h4>
                              {entry.date && (
                                <span className="text-sm text-zinc-600">
                                  {entry.date}
                                </span>
                              )}
                            </div>
                            <p className="text-sm mt-1">{entry.description}</p>
                            {entry.link && (
                              <a
                                href={entry.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-sm mt-1 inline-block"
                              >
                                {entry.link}{" "}
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
    </>
  );
}
