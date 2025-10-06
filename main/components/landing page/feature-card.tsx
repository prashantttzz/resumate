"use client"

import { JSX, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Sparkles, CheckCircle, BarChart, Layout, Download, Edit } from "lucide-react"

interface FeatureCardProps {
  title: string
  description: string
  icon: string
  delay?: number
}

export default function FeatureCard({ title, description, icon, delay = 0 }: FeatureCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const getIcon = (): JSX.Element => {
    switch (icon) {
      case "sparkles":
        return <Sparkles className="h-5 w-5 text-main" />
      case "check-circle":
        return <CheckCircle className="h-5 w-5 text-main" />
      case "bar-chart":
        return <BarChart className="h-5 w-5 text-main" />
      case "layout":
        return <Layout className="h-5 w-5 text-main" />
      case "download":
        return <Download className="h-5 w-5 text-main" />
      case "edit":
        return <Edit className="h-5 w-5 text-main" />
      default:
        return <Sparkles className="h-5 w-5 text-main" />
    }
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="group rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-800 to-zinc-900 p-6 backdrop-blur-sm relative overflow-hidden"
    >
      {/* Background glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>

      {/* Content */}
      <div className="relative z-10">
        <div className="mb-4 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 p-3 w-fit group-hover:from-zinc-600 group-hover:to-zinc-700 transition-colors duration-300">
          <motion.div
            animate={{ rotate: [0, 5, 0, -5, 0] }}
            transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
            className="text-white"
          >
            {getIcon()}
          </motion.div>
        </div>

        <h3 className="text-lg font-semibold mb-2 group-hover:text-white transition-colors duration-300">{title}</h3>
        <p className="text-zinc-400 text-sm group-hover:text-zinc-300 transition-colors duration-300">{description}</p>

        <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-xs text-white font-medium flex items-center">
            Learn more <ArrowRight className="ml-1 h-3 w-3" />
          </span>
        </div>
      </div>
    </motion.div>
  )
}

// Import ArrowRight at the top
import { ArrowRight } from "lucide-react"
