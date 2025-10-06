"use client";
import { ResumeManagementClient } from "@/components/resume/resume-management"
import { useGetAllCoverLetter } from "@/query/resume/query";

export default function CoverLetterPage() {
    const{data,isPending,isError}=useGetAllCoverLetter()
  return (
    <div className="flex flex-col gap-6 animate-in">
      <div>
        <h1 className="text-2xl font-medium">My Cover Letters</h1>
        <p className="text-muted-foreground">Manage and edit your professional cover letter</p>
      </div>

      <ResumeManagementClient data={data} isPending={isPending} isError={isError} type="cover letter"/>
    </div>
  )
}
