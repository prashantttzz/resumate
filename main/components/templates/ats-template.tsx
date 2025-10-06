import { EntryType, TemplateProps } from "@/types/resume";

const formatDate = (dateString: string) => {
  if (!dateString) return "Present";
  return new Date(dateString)
    .toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    })
    .toUpperCase();
};

const ResumeEntry = ({
  title,
  subtitle,
  startDate,
  endDate,
  isCurrent,
  children,
}: any) => (
  // Reduced bottom margin from mb-5 to mb-4
  <article className="mb-4">
    <div className="flex flex-col sm:flex-row justify-between sm:items-start">
      <div>
        <h3 className="text-base font-semibold text-slate-800">{title}</h3>
        <p className="text-sm text-slate-600">{subtitle}</p>
      </div>
      <p className="text-xs text-slate-500 mt-1 sm:mt-0">
        {formatDate(startDate)} - {isCurrent ? "PRESENT" : formatDate(endDate)}
      </p>
    </div>
    {children}
  </article>
);

export function ATSFriendlyTemplate({
  personal,
  education,
  experiences,
  projects,
  skills,
  custom,
  sectionOrder,
}: TemplateProps) {
  const sectionTitleClasses =
    "text-sm font-semibold text-slate-500 uppercase tracking-widest border-b border-slate-200 pb-1 mt-5 mb-3";
  const descriptionListClasses =
    "list-disc pl-5 mt-1.5 text-sm text-slate-600 space-y-1";

  return (
    <main className="p-6 print:p-0 text-slate-700">
      <header className="mb-2 text-left ">
        <h1 className="text-3xl font-semibold text-slate-900">
          {personal.fullName}
        </h1>
        <p className="text-lg text-slate-600 mt-1">{personal.jobTitle}</p>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
          {personal.email && (
            <a
              href={`mailto:${personal.email}`}
              className="hover:text-blue-600"
            >
              {personal.email}
            </a>
          )}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.linkedin && (
            <a
              href={personal.linkedin}
              className="hover:text-blue-600 underline"
            >
              LinkedIn
            </a>
          )}
          {personal.github && (
            <a href={personal.github} className="hover:text-blue-600 underline">
              GitHub
            </a>
          )}
          {personal.website && (
            <a
              href={personal.website}
              className="hover:text-blue-600 underline"
            >
              Website
            </a>
          )}
        </div>
      </header>

      {sectionOrder.map((section) => {
        if (!section.isActive) return null;

        switch (section.title) {
          case "Personal Information":
            return personal.summary ? (
              <section key={section.title} className="page-section">
                <h2 className={sectionTitleClasses}>Summary</h2>
                <p className="text-sm text-slate-600">{personal.summary}</p>
              </section>
            ) : null;

          case "Experience":
            return (
              experiences.length > 0 && (
                <section key={section.title} className="">
                  <h2 className={sectionTitleClasses}>Experience</h2>
                  {experiences.map((exp) => (
                    <ResumeEntry
                      key={exp.id}
                      title={exp.position}
                      subtitle={`${exp.company}${
                        exp.location ? ` | ${exp.location}` : ""
                      }`}
                      startDate={exp.startDate}
                      endDate={exp.endDate}
                      isCurrent={exp.current}
                    >
                      {exp.description && (
                        <ul className={descriptionListClasses}>
                          {exp.description
                            .split("\n")
                            .filter((line) => line.trim())
                            .map((line, i) => (
                              <li key={i}>{line}</li>
                            ))}
                        </ul>
                      )}
                    </ResumeEntry>
                  ))}
                </section>
              )
            );

          case "Projects":
            return (
              projects.length > 0 && (
                <section key={section.title} className="">
                  <h2 className={sectionTitleClasses}>Projects</h2>
                  {projects.map((proj) => (
                    <ResumeEntry
                      key={proj.id}
                      title={proj.title}
                      subtitle={proj.role}
                      startDate={proj.startDate}
                      endDate={proj.endDate}
                      isCurrent={proj.current}
                    >
                      {proj.description && (
                        <ul className={descriptionListClasses}>
                          {proj.description
                            .split("\n")
                            .filter((line) => line.trim())
                            .map((line, i) => (
                              <li key={i}>{line}</li>
                            ))}
                        </ul>
                      )}
                      {proj.link && (
                        <p className="text-xs mt-1.5">
                          <span className="font-semibold uppercase tracking-wider">
                            Link:{" "}
                          </span>
                          <a
                            href={proj.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline break-all"
                          >
                            {proj.link}
                          </a>
                        </p>
                      )}
                    </ResumeEntry>
                  ))}
                </section>
              )
            );

          case "Education":
            return (
              education.length > 0 && (
                <section key={section.title} className="page-section">
                  <h2 className={sectionTitleClasses}>Education</h2>
                  {education.map((edu) => (
                    <ResumeEntry
                      key={edu.description}
                      title={edu.degree}
                      subtitle={`${edu.institution}${
                        edu.location ? ` | ${edu.location}` : ""
                      }`}
                      startDate={edu.startDate}
                      endDate={edu.endDate}
                      isCurrent={edu.current}
                    >
                      {edu.description && (
                        <ul className={descriptionListClasses}>
                          {edu.description
                            .split("\n")
                            .filter((line) => line.trim())
                            .map((line, i) => (
                              <li key={i}>{line}</li>
                            ))}
                        </ul>
                      )}
                    </ResumeEntry>
                  ))}
                </section>
              )
            );

          case "Skills":
            return (
              skills.length > 0 && (
                <section key={section.title} className="">
                  <h2 className={sectionTitleClasses}>Skills</h2>
                  {/* Reduced vertical space between skill categories from space-y-3 to space-y-2 */}
                  <div className="space-y-2">
                    {skills.map((category) => (
                      <div
                        key={category.id}
                        className="flex flex-col sm:flex-row sm:items-start gap-x-4 page-section"
                      >
                        <h4 className="flex-shrink-0 sm:w-40 text-sm font-semibold text-slate-700">
                          {category.name}
                        </h4>
                        <p className="text-sm text-slate-600 mt-1 sm:mt-0">
                          {category.skills
                            .map((skill) => skill.name)
                            .join(" | ")}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )
            );

          case "Custom Sections":
            return custom.length > 0 ? (
              <>
                {custom.map(
                  (customSection) =>
                    customSection.entries.length > 0 && (
                      <section key={customSection.id} className="page-section">
                        <h2 className={sectionTitleClasses}>
                          {customSection.title}
                        </h2>
                        {customSection.entries.map((entry) => (
                          <article key={entry.id} className="mb-4">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-start">
                              <h3 className="text-sm font-semibold text-slate-800">
                                {entry.title}
                              </h3>
                              <p className="text-xs text-slate-500 mt-1 sm:mt-0">
                                {entry.date && formatDate(entry.date)}
                              </p>
                            </div>
                            {entry.description && (
                              <ul className={descriptionListClasses}>
                                {entry.description
                                  .split("\n")
                                  .filter((line) => line.trim())
                                  .map((line, i) => (
                                    <li key={i}>{line}</li>
                                  ))}
                              </ul>
                            )}
                          </article>
                        ))}
                      </section>
                    )
                )}
              </>
            ) : null;

          default:
            return null;
        }
      })}
    </main>
  );
}
