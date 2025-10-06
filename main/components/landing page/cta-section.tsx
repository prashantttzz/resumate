"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CtaSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.5 })

  return (
    <section ref={ref} className="py-24 px-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full filter blur-3xl opacity-70" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full filter blur-3xl opacity-70" />
        </div>
      </div>

      <div className="container mx-auto relative z-10">
        <motion.div
          className="max-w-4xl mx-auto bg-background rounded-2xl p-8 md:p-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6 mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-gray-700/50 to-gray-600/50 flex items-center justify-center"
          >
            <div className="text-3xl">✨</div>
          </motion.div>

          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Ready to Land Your Dream Job?
          </motion.h2>

          <motion.p
            className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Join thousands of job seekers who have successfully transformed their careers with our professional resume
            builder. Start creating your standout resume today.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-white to-gray-300 hover:from-gray-100 hover:to-gray-200 text-gray-900 rounded-lg px-8 py-6 text-lg font-medium group"
            >
                <Link href='/dashboard' >
              Create Your Resume Now
                </Link>
              <motion.span
                initial={{ x: 0 }}
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, repeatDelay: 1 }}
              >
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </motion.span>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
