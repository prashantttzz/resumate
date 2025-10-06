"use client";
import { ResumeManagementClient } from "@/components/resume/resume-management";
import { useGetAllResumes } from "@/query/resume/query";

export default function ResumesPage() {
  const { data, isError, isPending } = useGetAllResumes();
  return (
    <div className="flex flex-col gap-6 animate-in">
      <div>
        <h1 className="text-2xl font-medium">My Resumes</h1>
        <p className="text-muted-foreground">
          Manage and edit your professional resumes
        </p>
      </div>

      <ResumeManagementClient
        data={data}
        isPending={isPending}
        isError={isError}
        type="resume"
      />
    </div>
  );
}
