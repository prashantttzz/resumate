"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Crown, CheckCircle2, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

type ProStatusButtonProps = {
  isPro?: boolean
  loading?: boolean
  onUpgradeClick?: () => void
  onManageClick?: () => void
  className?: string
  size?: "default" | "sm" | "lg" | "icon"
}

export default function ProStatusButton({
  isPro,
  loading = false,
  onUpgradeClick,
  onManageClick,
  className,
  size = "default",
}: ProStatusButtonProps) {
  const handleClick = () => {
    if (loading) return
    if (isPro) onManageClick?.()
    else onUpgradeClick?.()
  }

  const label = loading ? "Checking..." : isPro ? "Pro Active" : "Upgrade to Pro"

  return (
    <Button
      aria-pressed={isPro}
      aria-busy={loading}
      onClick={handleClick}
      size={size}
      className={cn(
        "relative overflow-hidden transition-all hover:bg-none",
        isPro
          ? "bg-card border-[1px] border-gray-700 hover:bg-none"
          : "bg-card text-gray-800 border-[1px] border-gray-700 ",
        className,
      )}
      variant="ghost"
    >
      {/* Icon */}
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : isPro ? (
        <Crown className="mr-2 h-4 w-4 text-main" />
      ) : (
        <Crown className="mr-2 h-4 w-4 text-main" />
      )}

      {/* Label */}
      <span className="font-medium text-white">{label}</span>

      {/* Pro badge/right adornment */}
      {isPro && !loading && (
        <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-main px-2 py-0.5 text-xs">
          <CheckCircle2 className="h-3.5 w-3.5" />
          {"PRO"}
        </span>
      )}

      {/* Subtle sheen for Pro */}
      {isPro && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 -left-1 w-1/3 bg-gradient-to-r from-white/10 to-transparent"
          initial={{ x: "-150%" }}
          animate={{ x: ["-150%", "150%"] }}
          transition={{ duration: 2.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.4 }}
        />
      )}
    </Button>
  )
}
