"use client"

import { useRef, useEffect } from "react"
import { motion, useAnimation, useInView } from "framer-motion"

export default function HeroAnimation() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  // Mouse follow effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return

      const { left, top, width, height } = ref.current.getBoundingClientRect()
      const x = (e.clientX - left) / width - 0.5
      const y = (e.clientY - top) / height - 0.5

      ref.current.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`
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

  const glowVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 0.6,
      scale: 1,
      transition: { duration: 1.5, ease: "easeInOut" },
    },
  }

  return (
    <div className="relative">
      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={containerVariants}
        className="relative transition-transform duration-300 ease-out will-change-transform"
      >
        {/* Resume mockup */}
        <div className="relative w-[320px] md:w-[380px] h-[500px] md:h-[580px] rounded-2xl border border-zinc-700 bg-gradient-to-br from-zinc-800 to-zinc-900 shadow-2xl overflow-hidden">
          {/* Header */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-zinc-800 to-zinc-900 p-4 border-b border-zinc-700 flex items-center justify-between"
          >
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-zinc-600"></div>
              <div className="w-3 h-3 rounded-full bg-zinc-600"></div>
              <div className="w-3 h-3 rounded-full bg-zinc-600"></div>
            </div>
            <div className="w-24 h-4 bg-zinc-700 rounded-full"></div>
          </motion.div>

          {/* Content */}
          <div className="p-6 space-y-6 ">
           <motion.div
              variants={itemVariants}
              className="w-40 h-8 bg-gradient-to-r from-zinc-700 to-zinc-800 rounded-md"
            ></motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <div className="w-full h-4 bg-zinc-800 rounded-md"></div>
              <div className="w-full h-4 bg-zinc-800 rounded-md"></div>
              <div className="w-3/4 h-4 bg-zinc-800 rounded-md"></div>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-4 space-y-2">
              <div className="w-1/3 h-5 bg-gradient-to-r from-zinc-700 to-zinc-800 rounded-md"></div>
              <div className="w-full h-4 bg-zinc-800 rounded-md"></div>
              <div className="w-full h-4 bg-zinc-800 rounded-md"></div>
              <div className="w-2/3 h-4 bg-zinc-800 rounded-md"></div>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-4 space-y-2">
              <div className="w-1/3 h-5 bg-gradient-to-r from-zinc-700 to-zinc-800 rounded-md"></div>
              <div className="w-full h-4 bg-zinc-800 rounded-md"></div>
              <div className="w-full h-4 bg-zinc-800 rounded-md"></div>
              <div className="w-3/4 h-4 bg-zinc-800 rounded-md"></div>
            </motion.div>

            <motion.div variants={itemVariants} className="pt-4 space-y-2">
              <div className="w-1/3 h-5 bg-gradient-to-r from-zinc-700 to-zinc-800 rounded-md"></div>
              <div className="w-full h-4 bg-zinc-800 rounded-md"></div>
              <div className="w-2/3 h-4 bg-zinc-800 rounded-md"></div>
            </motion.div> 

          </div>

          {/* Animated cursor */}
          <motion.div
            initial={{ opacity: 0, x: 100, y: 100 }}
            animate={{
              opacity: [0, 1, 1, 0],
              x: [100, 150, 200, 250],
              y: [100, 150, 200, 250],
            }}
            transition={{
              duration: 3,
              times: [0, 0.2, 0.8, 1],
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 2,
            }}
            className="absolute w-6 h-6 pointer-events-none"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 3L19 12L5 21V3Z" fill="white" />
            </svg>
          </motion.div>
        </div>

        {/* Glow effects */}
        <motion.div
          variants={glowVariants}
          className="absolute -right-20 -top-20 w-60 h-60 rounded-full bg-gradient-to-br from-white/10 to-transparent blur-3xl"
        ></motion.div>

        <motion.div
          variants={glowVariants}
          className="absolute -left-20 -bottom-20 w-60 h-60 rounded-full bg-gradient-to-tr from-white/10 to-transparent blur-3xl"
        ></motion.div>
      </motion.div>

      {/* Floating elements */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="absolute -right-6 top-1/4 w-12 h-12 rounded-full border border-zinc-700 bg-gradient-to-br from-zinc-800 to-zinc-900"
      ></motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute right-1/4 -bottom-6 w-16 h-16 rounded-full border border-zinc-700 bg-gradient-to-br from-zinc-800 to-zinc-900"
      ></motion.div>

      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute -left-4 bottom-1/3 w-8 h-8 rounded-full border border-zinc-700 bg-gradient-to-br from-zinc-800 to-zinc-900"
      ></motion.div>

      {/* "Live editing" indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-zinc-800 to-zinc-900 text-white text-xs font-medium py-1 px-3 rounded-full border border-zinc-700 flex items-center gap-1"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        Live Preview
      </motion.div>
    </div>
  )
}
