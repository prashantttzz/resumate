"use client";

import { ResumeList } from "@/components/dashboard/resume-list";
import { useGetAllCoverLetter, useGetAllResumes } from "@/query/resume/query";
import { toast } from "sonner";
import { useEffect } from "react";
import { ResumeNotFound } from "@/components/error";
import { PlanOverview } from "@/components/dashboard/plan-overview";
import { DashboardStats } from "@/components/dashboard/dashboard-cards";
import { UpcomingFeatures } from "@/components/dashboard/upcoming-features";
import { useSession } from "next-auth/react";
import { isPremium } from "@/query/user/query";
import { CoverLetterNotFound } from "@/components/coverletter-error";
import NewResume from "@/components/NewResume";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardClient() {
  const { data: resumes, isError, error, isPending } = useGetAllResumes();

  const {
    data: coverLetters,
    isError: clIsError,
    error: clError,
    isPending: clPending,
  } = useGetAllCoverLetter();

  const {
    data: premiumData,
    isError: isPremiumError,
    error: premiumerror,
    isPending: premiumloading,
  } = isPremium();

  const session = useSession();
  const user = session.data?.user;
  const premium = premiumData?.isPremium;

  useEffect(() => {
    if (isError || isPremiumError) {
      toast.error(error?.message || premiumerror?.message);
    }
  }, [isError, error, isPremiumError, premiumerror]);

  if (isPending || premiumloading || clPending) {
    return (
      <div className="flex flex-col gap-8 animate-in">
        <div>
          <div className="flex justify-between w-full items-center">
            <Skeleton className="h-6 w-[300px]" />
            <Skeleton className="h-10 w-[120px]" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <Skeleton className="h-[120px] w-full" />
          <Skeleton className="h-[120px] w-full" />
          <Skeleton className="h-[120px] w-full" />
        </div>

        <Skeleton className="h-[300px] w-full" />

        <div className="flex gap-8">
          <Skeleton className="h-[300px] flex-1" />
          <Skeleton className="h-[300px] flex-1" />
        </div>
      </div>
    );
  }
  if (!resumes) {
    return <ResumeNotFound variant="empty" />;
  }
  if (!coverLetters) {
    return <CoverLetterNotFound variant="empty" />;
  }
  return (
    <div className="flex flex-col gap-8 animate-in">
      <div>
        <div className="flex justify-between w-full items-center">
          <div>
            <p className="text-muted-white ">
              Welcome
              <span className="text-main px-4 font-semibold text-2xl">
                {user?.name}
              </span>
              to your workspace.
            </p>
          </div>
          <NewResume text={true} type="resume" />
        </div>
      </div>

      <DashboardStats
        resume={resumes}
        premium={premium || false}
        cv={coverLetters}
      />
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
