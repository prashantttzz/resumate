import { CoverLetterTemplateProps } from "@/types/resume";

type Props = {
  data: CoverLetterTemplateProps;
};

const modernTemp = ({ data }: Props) => {
  return (
    <div className="max-w-3xl mx-auto  p-4 text-[#111827] font-sans space-y-8 ">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-300 pb-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{data.fullName}</h1>
          <p className="text-gray-600">{data.jobTitle}</p>
        </div>
        <div className="mt-4 sm:mt-0 text-sm text-gray-500 space-y-1 sm:text-right">
          <p>{data.email}</p>
          <p>{data.phone}</p>
        </div>
      </header>

      {/* Salutation */}
      <p className="leading-relaxed">Dear {data.hiringManager || "Hiring Manager"},</p>

      {/* Body */}
      <section className="whitespace-pre-line text-[15px] leading-7 tracking-normal text-gray-800">
        <p>{data.content}</p>
      </section>

      {/* Closing */}
      <section className="pt-6 space-y-2">
        <p>Best regards,</p>
        <p className="font-medium">{data.fullName}</p>
      </section>
    </div>
  );
};

export default modernTemp;
