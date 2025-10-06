"use client";
import { LoaderCircle } from "lucide-react";
import { useCoverLetterById } from "@/query/resume/query";
import { useParams } from "next/navigation";
import { CoverLetterNotFound } from "@/components/coverletter-error";
import ClEditor from "@/components/cover-letter/coverletter-editor";

export default function CoverLetterBuilder() {
  const params = useParams();
  const id = params.id as string;
  const { data, isPending: idloading ,refetch } = useCoverLetterById(id);
 
  if (idloading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }
  if (!data) {
    return <CoverLetterNotFound variant="error" />;
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      <ClEditor data={data}  refetchData={refetch} coverLetterId={id} />
      </div>
  );
}
