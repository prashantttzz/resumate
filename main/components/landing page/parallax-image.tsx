"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"

interface ParallaxImageProps {
  src: string
  width: number
  height: number
  alt: string
  className?: string
}

export default function ParallaxImage({ src, width, height, alt, className = "" }: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [-50, 50])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.6, 1, 1, 0.6])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, amount: 0.3 }}
      className="relative overflow-hidden"
    >
      <motion.div style={{ y, scale, opacity }} className="will-change-transform">
        <Image
          src={src || "/placeholder.svg"}
          width={width}
          height={height}
          alt={alt}
          className={`w-full h-auto ${className}`}
        />
      </motion.div>
    </motion.div>
  )
}
