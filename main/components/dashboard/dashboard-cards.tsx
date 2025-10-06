import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { ResumeLimitIndicator } from "./resume-limit-indicator";
import { CoverLetter, resume } from "@/types/resume";
import { GithubConnectionCard } from "./github-connect-card";
import { AiAssistantCard } from "./ai-asssistant-card";
import ResumeStatsCard from "../ResumeStat";

export function DashboardStats({
  resume,
  premium,
  cv,
}: {
  resume: resume[];
  premium: boolean;
  cv: CoverLetter[];
}) {
  const isPremium = premium;
  const resumeCount = resume.length;
  const cvCount = cv.length;
  const totalViews = resume.reduce((acc, res) => acc + (res.views || 0), 0);

  return (
    <div className="hidden md:grid gap-4 md:grid-cols-2 lg:grid-cols-3 h-[180px]">
      <ResumeStatsCard
        resumeCount={resumeCount}
        coverLetterCount={cvCount}
        isPremium={isPremium}
      />
      <GithubConnectionCard />
      <AiAssistantCard isPremium={isPremium} />
    </div>
  );
}
