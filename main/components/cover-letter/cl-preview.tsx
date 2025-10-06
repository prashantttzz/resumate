import React from "react";
import { CoverLettertemplateMap } from "./cover-letter-template-map";
import { CoverLetterProps } from "@/types/resume";

interface LetterPreviewProps {
  coverLetterData: CoverLetterProps;
}

const Clpreview = React.forwardRef<HTMLDivElement, LetterPreviewProps>(({ coverLetterData }, ref) => {
  const TemplateComponent = CoverLettertemplateMap[coverLetterData.template];

  if (!TemplateComponent) {
    console.warn(`No template component found for template: ${coverLetterData.template}`);
    return (
      <div ref={ref} className="min-w-[800px] bg-white p-5 md:p-8 mx-auto text-center text-red-500">
        <p>Error: Cover letter template not found or invalid.</p>
        <p>Please select a valid template.</p>
      </div>
    );
  }

  return (
    <div ref={ref} className="min-w-[800px] bg-white p-5 md:p-8 mx-auto">
      <TemplateComponent data={coverLetterData} />
    </div>
  );
});

Clpreview.displayName = 'Clpreview';
export default Clpreview;
