import { CoverLetterTemplateProps } from "@/types/resume";
 type Props={
  data:CoverLetterTemplateProps
 }
const minimalTemp = ({data}: Props) => {
  return (
    <div className="max-w-2xl  mx-auto  font-sans text-[14px] text-gray-800  space-y-6">
      {/* Header */}
      <header className="space-y-1 border-b pb-4 border-gray-300">
        <h1 className="text-[20px] font-bold">{data.title}</h1>
        <p>{data.fullName}</p>
        <p className="text-sm text-gray-600">{data.jobTitle}</p>
        <div className="flex gap-4 text-sm text-gray-600 pt-1 flex-wrap">
          <span>{data.email}</span>
          <span>{data.phone}</span>
        </div>
      </header>

      {/* Salutation */}
      <p>Dear {data.hiringManager || "Hiring Manager"},</p>

      {/* Main Content */}
      <section className="whitespace-pre-line space-y-4">
        {/* 🔽 Main Content Goes Here */}
        <p>{data.content}</p>
      </section>

      {/* Closing */}
      <section className="space-y-2">
        <p>Sincerely,</p>
        <p>{data.fullName}</p>
      </section>
    </div>
  );
};

export default minimalTemp;
