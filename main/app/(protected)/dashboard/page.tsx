"use client";
import { ResumeList } from "@/components/dashboard/resume-list";
import { useGetAllCoverLetter, useGetAllResumes } from "@/query/resume/query";
import { Bot, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";
import { ResumeNotFound } from "@/components/error";
import { PlanOverview } from "@/components/dashboard/plan-overview";
import { DashboardStats } from "@/components/dashboard/dashboard-cards";
import { UpcomingFeatures } from "@/components/dashboard/upcoming-features";
import { useSession } from "next-auth/react";
import { isPremium } from "@/query/user/query";
import { CoverLetterList } from "@/components/dashboard/coverletter-list";
import { CoverLetterNotFound } from "@/components/coverletter-error";
import NewResume from "@/components/NewResume";

export default function DashboardPage() {
  const { data: resumes, isError, error, isPending } = useGetAllResumes();
  const {
    data: coverLetters,
    isError: clIsError,
    error: clError,
    isPending: clPending,
  } = useGetAllCoverLetter();
  const {
    data,
    isError: isPremiumError,
    error: premiumerror,
    isPending: premiumloading,
  } = isPremium();

  const session = useSession();
  const user = session.data?.user;
  const premium = data?.isPremium;
  useEffect(() => {
    if (isError || isPremiumError ) {
      toast.error(error?.message || premiumerror?.message);
    }
  }, [
    isError,
    error,
    isPremiumError,
    premiumerror,
    resumes,
    isPending,
    clError,
    clIsError,
    clPending,
  ]);

  if (isPending || premiumloading || clPending) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }
  if (!resumes) {
    return <ResumeNotFound variant="empty" />;
  }
  if (!coverLetters ) {
    return <CoverLetterNotFound variant="empty" />;
  }

  return (
    <div className="flex flex-col gap-8 animate-in">
      <div>
        <h1 className="text-2xl font-medium">Dashboard</h1>
   <div className="flex justify-between w-full items-center mt-10">
        <div>
         <p className="text-muted-white ">
          Welcome{" "}
          <span className="text-main  font-semibold text-2xl">
            {user?.name}
          </span>{" "}
          to your workspace.
        </p>
       </div>
<div className="flex items-center  justify-center gap-2 bg-white text-black rounded-md px-2 py-1 font-semibold">
  Create     <NewResume type="resume"/>
  </div>   </div>
      </div>

      <DashboardStats resume={resumes} premium={premium || false} cv={coverLetters}/>
      <div className=" flex flex-col md:flex-row w-full  md:items-center justify-between gap-10 ">
        <ResumeList resumes={resumes} />
      </div>
      <div className=" flex flex-col md:flex-row gap-10  justify-between">
        <PlanOverview resume={resumes} premium={premium || false} />
        <UpcomingFeatures />
      </div>
    </div>
  );
}
