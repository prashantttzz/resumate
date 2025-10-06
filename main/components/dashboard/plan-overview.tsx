"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Check, Crown, FileText, Zap } from "lucide-react";
import { resume } from "@/types/resume";
import PremiumButton from "../SubscriptionButton";
import Link from "next/link";

export function   PlanOverview({
  resume,
  premium,
}: {
  resume: resume[];
  premium: boolean;
}) {
  const [currentPlan, setCurrentPlan] = useState<"free" | "pro">("free");
  const [resumeCount, setResumeCount] = useState(resume.length);
  const maxFreeResumes = 3;
  useEffect(() => {
    if (premium) {
      setCurrentPlan("pro");
    }
  }, [premium]);

  return (
    <Card className="border-0 shadow-sm overflow-hidde flex-1">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-main">Your Plan</CardTitle>
          <Badge
            variant={currentPlan === "pro" ? "default" : "outline"}
            className="px-2.5 py-0.5"
          >
            {currentPlan === "pro" ? "Pro" : "Free"}
          </Badge>
        </div>
        <CardDescription className="text-white">
          {currentPlan === "pro"
            ? "You have access to all premium features"
            : `You can create up to ${maxFreeResumes} resumes with the free plan`}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-6">
        {currentPlan === "free" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>Resume Usage</span>
                </div>
                <span className="font-medium">
                  {resumeCount} of {maxFreeResumes}
                </span>
              </div>
              <Progress
                value={(resumeCount / maxFreeResumes) * 100}
                className="h-2"
              />
            </div>

            {!premium && (
              <div className="rounded-lg border bg-card p-4 mt-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Crown className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Upgrade to Pro</h3>
                    <p className="text-xs text-muted-foreground">
                      Unlock premium features
                    </p>
                  </div>
                </div>

                <div className="grid gap-2">
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-main mt-0.5" />
                    <div className="text-sm">
                      <span className="font-medium">Unlimited Resumes</span>
                      <p className="text-xs text-muted-foreground">
                        Create as many resumes as you need
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-main mt-0.5" />
                    <div className="text-sm">
                      <span className="font-medium">Premium Templates</span>
                      <p className="text-xs text-muted-foreground">
                        Access to all premium resume templates
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-main mt-0.5" />
                    <div className="text-sm">
                      <span className="font-medium">
                        AI Resume chat bot
                      </span>
                      <p className="text-xs text-muted-foreground">
                        Get AI-powered chat bot to improve your resume according to job description 
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {premium && (
          <div className="space-y-4 ">
            <div className="flex items-center gap-3 mb-10">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Crown className="h-7 w-7 text-main" />
              </div>
              <div>
                <h3 className="font-medium text-lg">Pro Plan Benefits</h3>
                <p className="text-xs text-white">
                  Your premium features
                </p>
              </div>
            </div>

            <div className="grid gap-3">
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-main mt-0.5" />
                <div className="text-sm">
                  <span className="font-medium">Unlimited Resumes</span>
                  <p className="text-xs text-muted-foreground">
                    Create as many resumes as you need
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-main mt-0.5" />
                <div className="text-sm">
                  <span className="font-medium">Premium Templates</span>
                  <p className="text-xs text-muted-foreground">
                    Access to all premium resume templates
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-main mt-0.5" />
                <div className="text-sm">
                  <span className="font-medium">AI Resume chat bot</span>
                  <p className="text-xs text-muted-foreground">
                    Get AI-powered chat bot to improve your resume according to job description
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-main mt-0.5" />
                <div className="text-sm">
                  <span className="font-medium">Priority Support</span>
                  <p className="text-xs text-muted-foreground">
                    Get help from our support team within 24 hours
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="bg-muted/20 pt-4 pb-4">
        {!premium ? (
          <div
            className="w-full bg-white rounded-2xl flex items-center justify-center font-semibold"
          >
            <Zap className="mr-2 h-4 w-4" />
            <PremiumButton />
          </div>
        ) : (
          <Button
            variant="outline"
            className="w-full"
          >
            <Link href={'/pro'}>
            Manage Subscription
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
