"use client";
import { ResumeEditor } from "@/components/resume/resume-editor";
import { mergeResumeData } from "@/lib/resume-merger";
import { useGetResumebyId, useUpdateTitle } from "@/query/resume/query";
import { useGetGithubProfile } from "@/query/user/query";
import {  LoaderCircle } from "lucide-react";
import { useParams } from "next/navigation";

export default function ResumePage() {
  const params = useParams();
  const id = params.id as string;

  const { data: resumeData, isPending: isResumeLoading } = useGetResumebyId(id);
  const { data: githubData, isLoading: isGithubLoading } =
    useGetGithubProfile();



  if (isResumeLoading || isGithubLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  const mergedData = mergeResumeData(resumeData, githubData?.data);

  if (!mergedData) {
    return (
      <div className="p-10 text-center text-red-400">
        Error: Could not load resume data.
      </div>
    );
  }

  return (
    <div className=" animate-in ">
      <ResumeEditor
        data={mergedData}
        id={id}
        title={mergedData.title || "Resume"}
        githubProfile={githubData?.data}
      />
    </div>
  );
}
