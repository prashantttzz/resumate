import { CoverLetterTemplateProps } from "@/types/resume";
import minimalTemp from "./template-coverLetter/minimalTemp";
import modernTemp from "./template-coverLetter/modernTemp";
import cleanCorporateTemp from "./template-coverLetter/classicTemp";
type Props = {
  data: CoverLetterTemplateProps;
};
export const CoverLettertemplateMap: Record<string, React.FC<Props>> = {
  classic: cleanCorporateTemp,
  minimal: minimalTemp,
  modern: modernTemp,
};
