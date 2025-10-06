"use client";
import { CoverLettertemplateMap } from "@/components/cover-letter/cover-letter-template-map";
import minimalTemp from "@/components/cover-letter/template-coverLetter/minimalTemp";
import { CoverLetterNotFound } from "@/components/coverletter-error";
import Loader from "@/components/Loader";
import { useCoverLetterById } from "@/query/resume/query";
import { useParams } from "next/navigation";
import React from "react";

const CoverLetterPage = () => {
  const params = useParams();
  const id = params.id as string;
  const { data, isPending, isError, error } = useCoverLetterById(id);

  if (isError) return <CoverLetterNotFound variant="error" />;
  if (!data && !isPending) return <CoverLetterNotFound variant="empty" />;

  if (isPending) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  const Template = CoverLettertemplateMap[data.template] || minimalTemp;

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div
        className="bg-white w-full max-w-[800px] p-5 md:p-8"
        id="coverletter"
      >
        <Template data={data} />
      </div>
    </div>
  );
};

export default CoverLetterPage;
