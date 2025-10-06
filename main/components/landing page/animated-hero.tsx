"use client"

import { useEffect, useRef } from "react"
import { motion, useAnimation, useInView } from "framer-motion"

export default function AnimatedHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: false, amount: 0.3 })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return

      const { left, top, width, height } = containerRef.current.getBoundingClientRect()
      const x = (e.clientX - left) / width - 0.5
      const y = (e.clientY - top) / height - 0.5

      containerRef.current.style.transform = `perspective(1000px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  }

  return (
    <motion.div
      ref={containerRef}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
      className="relative transition-transform duration-300 ease-out will-change-transform"
    >
      <div className="relative h-[600px] w-[380px] overflow-hidden rounded-2xl border-2 border-zinc-700 bg-zinc-900 shadow-2xl">
        <motion.div className="absolute inset-0 flex flex-col" variants={containerVariants}>
          <motion.div
            variants={itemVariants}
            className="bg-zinc-800 p-5 flex items-center justify-between border-b border-zinc-700"
          >
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-zinc-500" />
              <div className="h-3 w-3 rounded-full bg-zinc-500" />
              <div className="h-3 w-3 rounded-full bg-zinc-500" />
            </div>
            <div className="h-5 w-28 rounded-full bg-zinc-700" />
          </motion.div>

          <div className="flex-1 p-8 flex flex-col gap-8">
            <motion.div variants={itemVariants} className="h-10 w-48 rounded-lg bg-zinc-800" />

            <motion.div variants={itemVariants} className="space-y-3">
              <div className="h-5 w-full rounded-lg bg-zinc-800" />
              <div className="h-5 w-full rounded-lg bg-zinc-800" />
              <div className="h-5 w-3/4 rounded-lg bg-zinc-800" />
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-3">
              <div className="h-6 w-1/2 rounded-lg bg-zinc-800" />
              <div className="h-5 w-full rounded-lg bg-zinc-800" />
              <div className="h-5 w-full rounded-lg bg-zinc-800" />
              <div className="h-5 w-3/4 rounded-lg bg-zinc-800" />
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-3">
              <div className="h-6 w-1/2 rounded-lg bg-zinc-800" />
              <div className="h-5 w-full rounded-lg bg-zinc-800" />
              <div className="h-5 w-full rounded-lg bg-zinc-800" />
              <div className="h-5 w-3/4 rounded-lg bg-zinc-800" />
            </motion.div>

            <motion.div variants={itemVariants} className="mt-auto flex justify-between">
              <div className="h-10 w-24 rounded-lg bg-white" />
              <div className="h-10 w-10 rounded-lg bg-zinc-800" />
            </motion.div>
          </div>
        </motion.div>

        {/* Animated glowing elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.7, scale: 1 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br from-white/10 to-zinc-800/5 blur-3xl"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.7, scale: 1 }}
          transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 0.5 }}
          className="absolute -bottom-24 -left-24 h-60 w-60 rounded-full bg-gradient-to-br from-white/10 to-zinc-800/5 blur-3xl"
        />
      </div>

      {/* Decorative elements */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="absolute -right-8 top-1/4 h-16 w-16 rounded-full border-2 border-zinc-700 bg-zinc-900"
      />
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="absolute -left-8 bottom-1/4 h-12 w-12 rounded-full border-2 border-zinc-700 bg-zinc-900"
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.4 }}
        className="absolute -bottom-8 right-1/4 h-20 w-20 rounded-full border-2 border-zinc-700 bg-zinc-900"
      />
    </motion.div>
  )
}
