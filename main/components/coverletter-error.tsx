import { cn } from "@/lib/utils"
import { FileX, FileQuestion, FilePlus } from "lucide-react"

interface ResumeNotFoundProps {
  className?: string
  variant?: "empty" | "search" | "error"
}

export function CoverLetterNotFound({ className, variant = "empty" }: ResumeNotFoundProps) {
  const icons = {
    empty: <FilePlus className="h-16 w-16 text-muted-foreground/30 mb-6" />,
    search: <FileQuestion className="h-16 w-16 text-muted-foreground/30 mb-6" />,
    error: <FileX className="h-16 w-16 text-muted-foreground/30 mb-6" />,
  }

  const titles = {
    empty: "No cover letter yet",
    search: "No matching cover letter",
    error: "Couldn't load cover letter",
  }

  const descriptions = {
    empty: "When you create a resume, it will appear here in your collection.",
    search: "We couldn't find any cover letter matching your search criteria.",
    error: "There was a problem loading your cover letter. Please try again later.",
  }

  return (
    <div className={cn("flex flex-col items-center justify-center py-16 text-center px-6", className)}>
      <div className="relative">
        {/* Decorative background elements */}
        <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-muted/30 -z-10" />
        <div className="absolute -bottom-8 -right-8 w-16 h-16 rounded-full bg-muted/20 -z-10" />
        <div className="absolute top-8 right-4 w-8 h-8 rounded-full bg-muted/40 -z-10" />

        {/* Icon */}
        {icons[variant]}
      </div>

      <div className="space-y-3 max-w-md relative">
        {/* Subtle divider line */}
        <div className="w-16 h-0.5 bg-muted-foreground/20 mx-auto mb-2" />

        <h3 className="text-2xl font-medium text-foreground tracking-tight">{titles[variant]}</h3>

        <p className="text-muted-foreground text-base leading-relaxed">{descriptions[variant]}</p>

        {/* Bottom decorative element */}
        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-muted-foreground/20 to-transparent mx-auto mt-6" />
      </div>
    </div>
  )
}
