import { CoverLetterTemplateProps } from "@/types/resume";

type Props = {
  data: CoverLetterTemplateProps;
};

const cleanCorporateTemp = ({ data }: Props) => {
  return (
    <div className="max-w-[800px] mx-auto p-4 bg-white text-[#333] font-sans text-[14px] leading-7 space-y-8">
      
      {/* Header */}
      <header className="border-b border-gray-300 pb-4">
        <h1 className="text-2xl font-bold text-[#1e3a8a] uppercase tracking-wide">
          {data.fullName}
        </h1>
        <p className="text-sm text-[#1e40af] font-medium">
          {data.jobTitle}
        </p>
        <div className="flex flex-wrap gap-x-6 text-sm text-gray-600 mt-2">
          <span>{data.email}</span>
          <span>{data.phone}</span>
        </div>
      </header>

      {/* Title */}
      <section>
        <h2 className="text-md font-semibold uppercase tracking-wide border-b border-gray-200 pb-1">
          Cover Letter
        </h2>
      </section>

      {/* Salutation + Content */}
      <section className="whitespace-pre-line text-[15px] text-gray-800 space-y-6">
        <p>Dear {data.hiringManager || "Hiring Manager"},</p>
        <p>{data.content}</p>
      </section>

      {/* Closing */}
      <section className="space-y-1">
        <p>Sincerely,</p>
        <p>{data.fullName}</p>
        <p className="text-sm text-gray-600">{data.jobTitle}</p>
      </section>
    </div>
  );
};

export default cleanCorporateTemp;
