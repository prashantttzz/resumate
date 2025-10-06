"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { UseGetAllUser } from "@/query/user/query"

interface StatItemProps {
  value: string
  label: string
  delay?: number
}

function StatItem({ value, label, delay = 0 }: StatItemProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay }}
      className="text-center"
    >
      <motion.div
        initial={{ scale: 0.5 }}
        animate={isInView ? { scale: 1 } : { scale: 0.5 }}
        transition={{ type: "spring", stiffness: 100, damping: 10, delay: delay + 0.2 }}
        className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent"
      >
        {value}
      </motion.div>
      <p className="text-zinc-400 mt-2 text-sm md:text-base">{label}</p>
    </motion.div>
  )
}

export default function AnimatedStats() {
    const{data,isLoading}=UseGetAllUser();
  if(isLoading||!data){
    return
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8">
      <StatItem value={`${data.length}+`} label="Active Users" delay={0} />
      <StatItem value="85%" label="Interview Rate" delay={0.1} />
      <StatItem value="10+" label="Templates" delay={0.2} />
      <StatItem value="4.9/5" label="User Rating" delay={0.3} />
    </div>
  )
}
