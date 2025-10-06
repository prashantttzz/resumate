"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { FileText, PenLine } from "lucide-react"

type Props = {
  resumeCount: number
  coverLetterCount: number
  className?: string
  isPremium?: boolean
  maxFreeResumes?: number
}

function useAnimatedNumber(value: number, duration = 600) {
  const [display, setDisplay] = React.useState(0)
  React.useEffect(() => {
    let raf = 0
    const start = performance.now()
    const from = display
    const delta = value - from
    const step = (t: number) => {
      const elapsed = t - start
      const p = Math.min(1, elapsed / duration)
      const eased = 1 - Math.pow(1 - p, 3) // easeOutCubic
      setDisplay(Math.round(from + delta * eased))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])
  return display
}

export function ResumeStatsCard({
  resumeCount,
  coverLetterCount,
  isPremium ,
  maxFreeResumes = 3,
}: Props) {
console.log("isssss",isPremium)
  const resumes = useAnimatedNumber(resumeCount)
  const covers = useAnimatedNumber(coverLetterCount)

  const capped = Math.max(0, Math.min(resumeCount, maxFreeResumes))
  const progress = !isPremium ? Math.round((capped / Math.max(1, maxFreeResumes)) * 100) : 100
  const limitReached = !isPremium && resumeCount >= maxFreeResumes

  return (
    <Card
      className="
        relative overflow-hidden border border-border/60 bg-card
        transition-shadow duration-300 ease-out hover:shadow-lg
        focus-within:ring-1 focus-within:ring-main/60 flex justify-center flex-col"
    > 
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-md bg-main/10 text-main ring-1 ring-main motion-safe:animate-[breathe_3s_ease-in-out_infinite]"
              aria-hidden
            >
              <FileText className="h-5 w-5" />
            </div>
            <div
              className="pointer-events-none absolute -right-2 -bottom-2 flex h-6 w-6 items-center justify-center rounded-md bg-main/10 text-main "
              aria-hidden
            >
              <PenLine className="h-3.5 w-3.5" />
            </div>
          </div>

          <div className="pl-3">
            <CardTitle className="text-lg text-pretty">Documents</CardTitle>
            <CardDescription className="text-sm text-white-700">Resumes and Cover Letters</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
    {isPremium &&     <div className="grid grid-cols-2 gap-3">
          <div className="rounded-md border  p-3 transition-colors">
            <div className="text-xs text-white">Resumes</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-semibold tabular-nums">{resumes}</span>
              <span className="text-xs text-main">total</span>
            </div>
          </div>
          <div className="rounded-md border p-3 transition-colors">
            <div className="text-xs text-white">Cover Letters</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-semibold tabular-nums">{covers}</span>
              <span className="text-xs text-main">total</span>
            </div>
          </div>
        </div>
        }

        {!isPremium && (
          <div className="mt-3 space-y-2" aria-live="polite">
            <div
              className="h-2 w-full overflow-hidden rounded bg-gray-200/60"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={maxFreeResumes}
              aria-valuenow={capped}
              aria-label="Free plan resume usage"
            >
              <div
                className="h-full rounded bg-main transition-[width] duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                Free plan: {capped}/{maxFreeResumes} resumes
              </span>
              {limitReached && (
                <span className="rounded-sm px-1.5 py-0.5 text-[11px] font-medium text-main ring-1 ring-main">
                  Limit reached
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>

      <style jsx>{`
        @keyframes breathe {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.08); }
          50% { transform: scale(1.03); box-shadow: 0 8px 24px -12px rgba(16, 185, 129, 0.16); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.08); }
        }
      `}</style>
    </Card>
  )
}

export default ResumeStatsCard
