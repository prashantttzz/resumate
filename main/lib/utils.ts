import { CoverLetterProps, DownloadCoverLetterParams } from "@/types/resume";
import { clsx, type ClassValue } from "clsx";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const downloadPdf = async ({
  resumeId,
  title,
  onStart,
  onSuccess,
  onError,
}: {
  resumeId: string;
  title: string;
  onStart?: () => void;
  onSuccess?: () => void;
  onError?: () => void;
}) => {
  try {
    onStart?.(); 
    const res = await fetch(`${process.env.NEXT_PUBLIC_RENDER_URL}generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ resumeId, title }),
    });
    if (!res.ok) {
      throw new Error("Something went wrong");
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${title}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);

    onSuccess?.(); // done
  } catch (err) {
    console.error("PDF download failed:", err);
    onError?.();
  }
};

export const downloadCoverLetter = async ({
  contentRef,
  title,
  onStart,
  onSuccess,
  onError,
}: DownloadCoverLetterParams) => {
  onStart?.(); 
  try {
    const input = contentRef.current;
    if (!input) {
      console.error("Content element for PDF conversion not found. Make sure the ref is correctly attached and the element is in the DOM.");
      throw new Error("Content element not found.");
    }
    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true, 
      logging: true, 
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4'); 
    const imgWidth = 210; 
    const pageHeight = 297; 
    const imgHeight = canvas.height * imgWidth / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${title || 'cover-letter'}.pdf`); 

    onSuccess?.(); // Done
  } catch (err) {
    console.error("PDF download failed:", err);
    onError?.();
  }
};


export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export async function callResumeAI(
  prompt: string,
  type: "summary" | "job-desc" | "project"
) {
  try {
    const res = await fetch("/api/ai-generate-res", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt, type }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to fetch AI response");
    }

    const data = await res.json();
    return data.res;
  } catch (err: any) {
    console.error("callResumeAI error:", err.message);
    throw err;
  }
}
export async function generateCoverletter({
  input,
  coverLetterId,
}: {
  input: CoverLetterProps;
  coverLetterId: string;
}) {
  try {
    const res = await fetch("/api/ai-coverLetter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input, coverLetterId }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to fetch AI response");
    }

    const data = await res.json();
    return data.res;
  } catch (err: any) {
    console.error("callResumeAI error:", err.message);
    throw err;
  }
}
