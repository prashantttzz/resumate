"use client"

import type { ReactNode } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

interface ParallaxSectionProps {
  children: ReactNode
  speed?: number
}

export default function ParallaxSection({ children, speed = 0.1 }: ParallaxSectionProps) {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, 100 * speed])

  return (
    <motion.div style={{ y }} className="relative">
      {children}
    </motion.div>
  )
}
