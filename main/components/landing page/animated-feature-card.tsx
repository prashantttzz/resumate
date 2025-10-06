"use client"

import { type ReactNode, useRef } from "react"
import { motion, useInView } from "framer-motion"

interface AnimatedFeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  delay?: number
}

export default function AnimatedFeatureCard({ icon, title, description, delay = 0 }: AnimatedFeatureCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.03 }}
      className="rounded-2xl border-2 border-zinc-700 bg-zinc-800 p-8 transition-all duration-300 hover:border-zinc-600 hover:shadow-lg hover:shadow-white/5"
    >
      <div className="grid gap-4">
        <div className="mb-2 rounded-full bg-zinc-700 p-3 w-fit">
          <div className="text-white">{icon}</div>
        </div>
        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="text-zinc-300 text-lg font-medium leading-relaxed">{description}</p>
      </div>
    </motion.div>
  )
}
