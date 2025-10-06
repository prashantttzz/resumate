import { EntryType, TemplateProps } from "@/types/resume";

export function TimelineTemplate({
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
      month: "long",
    });
  };

  const Section = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <section className="mb-5">
      <h2 className="text-[10px] font-bold uppercase tracking-wider text-blue-800 border-b border-gray-300 pb-1 mb-3">
        {title}
      </h2>
      <div className="space-y-4 text-[11px]">{children}</div>
    </section>
  );

  return (
    <>
      <div className="p-6 print:p-0  bg-white text-gray-700  text-[11px] leading-normal">
        {/* Header */}
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-800 tracking-normal">
            {personal.fullName}
          </h1>
          {personal.jobTitle && (
            <p className="text-md text-gray-500 mt-1 tracking-wide uppercase">
              {personal.jobTitle}
            </p>
          )}
          <div className="mt-4 pt-4 border-t border-gray-300 flex justify-between items-center text-[10px] text-gray-500">
            <div className="text-left">
              {personal.phone && <p>{personal.phone}</p>}
              {personal.email && (
                <p>
                  <a
                    href={`mailto:${personal.email}`}
                    className="hover:text-blue-800"
                  >
                    {personal.email}
                  </a>
                </p>
              )}
            </div>
            <div className="text-center">
              {personal.linkedin && (
                <p>
                  <a href={personal.linkedin} className="hover:text-blue-800">
                    {personal.linkedin}
                  </a>
                </p>
              )}
              {personal.website && (
                <p>
                  <a href={personal.website} className="hover:text-blue-800">
                    {personal.website}
                  </a>
                </p>
              )}
            </div>
            <div className="text-right">
              {personal.address && <p>{personal.address}</p>}
              {personal.github && (
                <p>
                  <a href={personal.github} className="hover:text-blue-800">
                    {personal.github}
                  </a>
                </p>
              )}
            </div>
          </div>
        </header>

        {sectionOrder.map((section) => {
          if (!section.isActive) return null;

          switch (section.title) {
            case "Personal Information":
              return personal.summary ? (
                <section key={section.title} className="mb-5 page-section">
                  <p className="text-center text-xs">{personal.summary}</p>
                </section>
              ) : null;

            case "Experience":
              return (
                experiences.length > 0 && (
                  <Section key={section.title} title="Professional Experience">
                    {experiences.map((exp, i) => (
                      <div key={i} className="page-section">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-sm text-gray-800">
                              {exp.position}
                            </h3>
                            <p className="text-xs font-semibold text-gray-600 italic">
                              {exp.company}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-semibold text-gray-500 whitespace-nowrap">
                              {exp.location}
                            </p>
                            <p className="text-xs font-medium text-gray-500 whitespace-nowrap">
                              {formatDate(exp.startDate)} -{" "}
                              {exp.current
                                ? "Present"
                                : formatDate(exp.endDate || "")}
                            </p>
                          </div>
                        </div>
                        {exp.description && (
                          <ul className="mt-1 list-disc pl-5 text-xs text-gray-600 space-y-1">
                            {exp.description
                              .split("\n")
                              .filter(Boolean)
                              .map((line, j) => (
                                <li key={j}>{line}</li>
                              ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </Section>
                )
              );

            case "Projects":
              return (
                projects.length > 0 && (
                  <Section key={section.title} title="Projects">
                    {projects.map((proj, i) => (
                      <div key={i} className="page-section">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-sm text-gray-800">
                              {proj.title}
                            </h3>
                            <p className="text-xs font-semibold text-gray-600 italic">
                              {proj.role}
                            </p>
                          </div>
                          <p className="text-xs font-medium text-gray-500 text-right whitespace-nowrap">
                            {formatDate(proj.startDate)} -{" "}
                            {proj.current
                              ? "Present"
                              : formatDate(proj.endDate || "")}
                          </p>
                        </div>
                        {proj.description && (
                          <p className="mt-1 text-xs text-gray-600">
                            {proj.description}
                          </p>
                        )}
                        {proj.link && (
                          <a
                            href={proj.link}
                            className="text-xs text-blue-700 hover:underline font-semibold mt-1 inline-block"
                          >
                            View Project
                          </a>
                        )}
                      </div>
                    ))}
                  </Section>
                )
              );

            case "Education":
              return (
                education.length > 0 && (
                  <Section key={section.title} title="Education">
                    {education.map((edu, i) => (
                      <div key={i} className="page-section">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-sm text-gray-800">
                              {edu.degree}
                            </h3>
                            <p className="text-xs font-semibold text-gray-600 italic">
                              {edu.institution}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-semibold text-gray-500 whitespace-nowrap">
                              {edu.location}
                            </p>
                            <p className="text-xs font-medium text-gray-500 whitespace-nowrap">
                              {formatDate(edu.startDate)} -{" "}
                              {edu.current
                                ? "Present"
                                : formatDate(edu.endDate || "")}
                            </p>
                          </div>
                        </div>
                        {edu.description && (
                          <p className="mt-1 text-xs text-gray-600">
                            {edu.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </Section>
                )
              );

            case "Skills":
              return (
                skills.length > 0 && (
                  <Section key={section.title} title="Skills">
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                      {skills.map((category, i) => (
                        <div key={i} className="page-section">
                          <ul className="list-disc pl-5 text-xs text-gray-600">
                            <li>
                              <strong>{category.name}:</strong>{" "}
                              {category.skills
                                .map((skill) => skill.name)
                                .join(", ")}
                            </li>
                          </ul>
                        </div>
                      ))}
                    </div>
                  </Section>
                )
              );

            case "Custom Sections":
              return (
                custom.length > 0 && (
                  <div className="page-break-before">
                    {custom.map(
                      (customSection) =>
                        customSection.entries.length > 0 && (
                          <Section
                            key={customSection.id}
                            title={customSection.title}
                          >
                            {customSection.entries.map((entry: EntryType) => (
                              <div key={entry.id} className="page-section">
                                <div className="flex justify-between items-start">
                                  <h3 className="font-bold text-sm text-gray-800">
                                    {entry.title}
                                  </h3>
                                  {entry.date && (
                                    <p className="text-xs font-medium text-gray-500">
                                      {entry.date}
                                    </p>
                                  )}
                                </div>
                                {entry.description && (
                                  <p className="mt-1 text-xs text-gray-600">
                                    {entry.description}
                                  </p>
                                )}
                                {entry.link && (
                                  <a
                                    href={entry.link}
                                    className="text-xs text-blue-700 hover:underline font-semibold mt-1 inline-block"
                                  >
                                    Learn More
                                  </a>
                                )}
                              </div>
                            ))}
                          </Section>
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
    </>
  );
}
