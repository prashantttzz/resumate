"use client"

import { motion } from "framer-motion"

export default function FloatingElements() {
  const elements = [
    { x: "10%", y: "20%", size: "h-16 w-16", delay: 0 },
    { x: "85%", y: "15%", size: "h-24 w-24", delay: 0.5 },
    { x: "70%", y: "60%", size: "h-20 w-20", delay: 1 },
    { x: "20%", y: "70%", size: "h-12 w-12", delay: 1.5 },
    { x: "40%", y: "30%", size: "h-8 w-8", delay: 2 },
    { x: "60%", y: "80%", size: "h-10 w-10", delay: 2.5 },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {elements.map((el, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full bg-white/5 backdrop-blur-md border border-white/10 ${el.size}`}
          style={{ left: el.x, top: el.y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: el.delay }}
        >
          <motion.div
            className="w-full h-full"
            animate={{
              y: [0, 15, 0],
              rotate: [0, 5, 0, -5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          />
        </motion.div>
      ))}
    </div>
  )
}
