import { EntryType, TemplateProps } from "@/types/resume";

export function BoldTemplate({
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
      <div className="p-6 print:p-0  text-zinc-800  min-h-[1123px] ">
        {/* Top Header */}
        <header className="text-center border-b-4 border-black pb-3">
          <h1 className="text-4xl font-bold tracking-tight">
            {personal.fullName}
          </h1>
          <p className="text-sm sm:text-base text-gray-700 mt-1">
            {personal.jobTitle}
          </p>
          <div className="mt-3 flex flex-wrap justify-center items-center gap-x-3 gap-y-1.5 text-xs sm:text-sm text-gray-600">
            {personal.email && (
              <a
                href={`mailto:${personal.email}`}
                className="flex items-center gap-1 hover:text-blue-600"
              >
                {/* Email Icon */}
                <span>{personal.email}</span>
              </a>
            )}
            {personal.phone && (
              <a
                href={`tel:${personal.phone}`}
                className="flex items-center gap-1 hover:text-blue-600"
              >
                {/* Phone Icon */}
                <span>{personal.phone}</span>
              </a>
            )}
            {personal.address && (
              <span className="flex items-center gap-1">{personal.address}</span>
            )}
            {personal.website && (
              <a
                href={personal.website}
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-blue-600"
              >
                Website
              </a>
            )}
            {personal.linkedin && (
              <a
                href={personal.linkedin}
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-blue-600"
              >
                LinkedIn
              </a>
            )}
            {personal.github && (
              <a
                href={personal.github}
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-blue-600"
              >
                GitHub
              </a>
            )}
          </div>
        </header>

        {/* Dynamic Sections */}
        {sectionOrder.map((section) => {
          if (!section.isActive) return null;

          const commonSectionClasses = "pt-6";
          const commonTitleClasses =
            " text-lg font-semibold uppercase border-b border-gray-300 pb-2 mb-4";
          const commonEntryWrapperClasses = "mb-4 last:mb-0";
          const commonEntryTitleClasses = "text-sm sm:text-base font-medium";
          const commonEntryMetaClasses = "text-xs sm:text-sm text-gray-500";
          const commonEntryDescriptionClasses =
            "text-sm text-gray-700 leading-snug mt-1";

          switch (section.title) {
            case "Personal Information":
              return personal.summary ? (
                <section
                  key={section.title}
                  className={`${commonSectionClasses} page-section`}
                >
                  <h2 className={commonTitleClasses}>Summary</h2>
                  <p className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
                    {personal.summary}
                  </p>
                </section>
              ) : null;

            case "Experience":
              return (
                experiences.length > 0 && (
                  <section key={section.title} className={`${commonSectionClasses} `}>
                    <h2 className={commonTitleClasses}>Experience</h2>
                    {experiences.map((exp, idx) => (
                      <div
                        key={idx}
                        className={`${commonEntryWrapperClasses} page-section`}
                      >
                        <div className="flex justify-between">
                          <h3 className={commonEntryTitleClasses}>
                            {exp.company}
                          </h3>
                          <span className={commonEntryMetaClasses}>
                            {formatDate(exp.startDate)} -{" "}
                            {exp.current
                              ? "Present"
                              : formatDate(exp.endDate || "")}
                          </span>
                        </div>
                        <p className={`${commonEntryMetaClasses} italic`}>
                          {exp.position}
                        </p>
                        {exp.location && (
                          <p className={`${commonEntryMetaClasses} italic`}>
                            {exp.location}
                          </p>
                        )}
                        {exp.description &&
                          (exp.description.includes("\n") ? (
                            <ul className="list-disc pl-4 text-sm text-gray-700 mt-1 space-y-1">
                              {exp.description.split("\n").map((line, j) => (
                                <li key={j}>{line}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className={commonEntryDescriptionClasses}>
                              {exp.description}
                            </p>
                          ))}
                      </div>
                    ))}
                  </section>
                )
              );

            case "Projects":
              return (
                projects.length > 0 && (
                  <section key={section.title} className={`${commonSectionClasses} `}>
                    <h2 className={commonTitleClasses}>Projects</h2>
                    {projects.map((proj, idx) => (
                      <div
                        key={idx}
                        className={`${commonEntryWrapperClasses} page-section`}
                      >
                        <div className="flex justify-between">
                          <h3 className={commonEntryTitleClasses}>
                            {proj.title}
                          </h3>
                          <span className={commonEntryMetaClasses}>
                            {formatDate(proj.startDate)} -{" "}
                            {proj.current
                              ? "Present"
                              : formatDate(proj.endDate || "")}
                          </span>
                        </div>
                        <div className=" flex justify-between">
                          <p className={`${commonEntryMetaClasses} italic`}>
                            {proj.role}
                          </p>
                          {proj.link && (
                            <a
                              href={proj.link}
                              className="text-blue-600 text-xs underline"
                              target="_blank"
                            >
                              {proj.link}
                            </a>
                          )}
                        </div>
                        {proj.description &&
                          (proj.description.includes("\n") ? (
                            <ul className="list-disc pl-4 text-sm text-gray-700 mt-1 space-y-1">
                              {proj.description
                                .split("\n")
                                .filter(Boolean)
                                .map((line, j) => (
                                  <li key={j}>{line}</li>
                                ))}
                            </ul>
                          ) : (
                            <p className={commonEntryDescriptionClasses}>
                              {proj.description}
                            </p>
                          ))}
                      </div>
                    ))}
                  </section>
                )
              );

            case "Education":
              return (
                education.length > 0 && (
                  <section
                    key={section.title}
                    className={`${commonSectionClasses} resume-section `}
                  >
                    <h2 className={commonTitleClasses}>Education</h2>
                    {education.map((edu, idx) => (
                      <div key={idx} className={commonEntryWrapperClasses}>
                        <div className="flex justify-between">
                          <h3 className={commonEntryTitleClasses}>
                            {edu.degree}
                          </h3>
                          <span className={commonEntryMetaClasses}>
                            {formatDate(edu.startDate)} -{" "}
                            {edu.current
                              ? "Present"
                              : formatDate(edu.endDate || "")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <p className={`${commonEntryMetaClasses} italic`}>
                            {edu.institution}
                          </p>
                          {edu.location && (
                            <p className={`${commonEntryMetaClasses} italic`}>
                              {edu.location}
                            </p>
                          )}
                        </div>
                        {edu.description && (
                          <p className={commonEntryDescriptionClasses}>
                            {edu.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </section>
                )
              );

            case "Skills":
              return (
                skills.length > 0 && (
                  <section key={section.title} className={`${commonSectionClasses} `}>
                    <h2 className={commonTitleClasses}>Skills</h2>
                    <div className="grid grid-cols-2 gap-5">
                      {skills.map((category, catIdx) => (
                        <div
                          key={catIdx}
                          className="page-section min-w-[120px]"
                        >
                          <h4 className="text-sm font-medium mb-1 text-gray-700">
                            {category.name}
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {category.skills.map((skill, i) => (
                              <span key={i} className=" px-1 py-0.5 text-[12px]">
                                {skill.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )
              );

            case "Custom Sections":
              return custom.length > 0 ? (
                <div key={section.title}>
                  {custom.map(
                    (customSection) =>
                      customSection.entries.length > 0 && (
                        <section
                          key={customSection.id}
                          className={`${commonSectionClasses} `}
                        >
                          <h2 className={commonTitleClasses}>
                            {customSection.title}
                          </h2>
                          {customSection.entries.map((entry: EntryType) => (
                            <div
                              key={entry.id}
                              className={`${commonEntryWrapperClasses} page-section`}
                            >
                              <div className="flex justify-between">
                                <h3 className={commonEntryTitleClasses}>
                                  {entry.title}
                                </h3>
                                {entry.date && (
                                  <span className={commonEntryMetaClasses}>
                                    {entry.date}
                                  </span>
                                )}
                              </div>
                              {entry.description && (
                                <p className={commonEntryDescriptionClasses}>
                                  {entry.description}
                                </p>
                              )}
                              {entry.link && (
                                <a
                                  href={entry.link}
                                  className="text-blue-600 text-xs underline mt-1 inline-block"
                                  target="_blank"
                                >
                                  View More
                                </a>
                              )}
                            </div>
                          ))}
                        </section>
                      )
                  )}
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
