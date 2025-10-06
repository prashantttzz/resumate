import { Progress } from "@/components/ui/progress"
import { FileText, AlertCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ResumeLimitIndicatorProps {
  currentCount: number
  maxCount: number
}

export function ResumeLimitIndicator({ currentCount, maxCount }: ResumeLimitIndicatorProps) {
  const percentage = (currentCount / maxCount) * 100
  const isNearLimit = currentCount >= maxCount - 1
  const isAtLimit = currentCount >= maxCount

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs gap-2">
        <div className="flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">Resume Limit</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={isAtLimit ? "text-destructive font-medium" : "font-medium"}>
            {currentCount}/{maxCount}
          </span>
          {isNearLimit && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <AlertCircle className={`h-3.5 w-3.5 ${isAtLimit ? "text-destructive" : "text-amber-500"}`} />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {isAtLimit
                      ? "You've reached your resume limit. Upgrade to Pro for unlimited resumes."
                      : "You're approaching your resume limit. Consider upgrading to Pro for unlimited resumes."}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
      <Progress
        value={percentage}
        className={`h-1.5 ${isAtLimit ? "bg-destructive/20" : "bg-secondary"}${isAtLimit ? "bg-destructive" : isNearLimit ? "bg-amber-500" : undefined}`}
      />
    </div>
  )
}
