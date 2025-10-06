"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const testimonials = [
  {
    id: 1,
    name: "Pooja Mehta",
    role: "B.Com Graduate, Indore",
    image: "/placeholder.svg?height=80&width=80&text=PM",
    content:
      "I was struggling to make my resume for banking jobs. ResuMate made everything so simple. The AI helped me write a proper summary and I finally got selected for an interview at HDFC Bank.",
  },
  {
    id: 2,
    name: "Ravi Kumar",
    role: "Fresher, BA Student from Kanpur",
    image: "/placeholder.svg?height=80&width=80&text=RK",
    content:
      "I didn’t have much experience and was nervous about job hunting. ResuMate gave me the confidence to apply by showing me how to highlight my skills properly. Got my first job at a local office!",
  },
  {
    id: 3,
    name: "Neha Singh",
    role: "Sales Executive, Jaipur",
    image: "/placeholder.svg?height=80&width=80&text=NS",
    content:
      "After graduation, I was applying randomly with no results. I used ResuMate and within a week, my resume looked much better. Got interview calls from 2 companies and joined a retail chain as a sales executive.",
  },
  {
    id: 4,
    name: "Amit Chauhan",
    role: "Data Entry Operator, Patna",
    image: "/placeholder.svg?height=80&width=80&text=AC",
    content:
      "ResuMate helped me build a clean, simple resume . I printed it and submitted to a few local offices. Within 2 weeks, I got a call and now I'm working at a small IT firm.",
  },
];


export default function TestimonialSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.3 })

  const handlePrev = () => {
    setDirection(-1)
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setDirection(1)
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 200 : -200,
      opacity: 0,
    }),
  }

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-zinc-900 to-zinc-950 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03),transparent_70%)]"></div>
      <div className="container px-4 md:px-6 relative" ref={containerRef}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block rounded-full bg-gradient-to-r from-zinc-800 to-zinc-700 px-4 py-1.5 text-sm font-medium mb-4 border border-zinc-700">
            Testimonials
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">What our users are saying</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Join thousands of professionals who have transformed their career with ResuMate.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto relative">
          <div className="relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 p-6 md:p-10">
            <div className="absolute top-6 right-10 text-zinc-700">
              <Quote size={120} />
            </div>

            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={activeIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="relative z-10"
              >
                <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                  <div className="flex-shrink-0">
                    <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-zinc-700">
                      <Image
                        src={testimonials[activeIndex].image || "/placeholder.svg"}
                        alt={testimonials[activeIndex].name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-lg md:text-xl text-zinc-300 italic mb-4">
                      "{testimonials[activeIndex].content}"
                    </p>
                    <div>
                      <h4 className="font-bold text-white">{testimonials[activeIndex].name}</h4>
                      <p className="text-zinc-400 text-sm">{testimonials[activeIndex].role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-zinc-700 hover:bg-zinc-800"
              onClick={handlePrev}
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Previous</span>
            </Button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    index === activeIndex ? "bg-white" : "bg-zinc-700 hover:bg-zinc-600"
                  }`}
                  onClick={() => {
                    setDirection(index > activeIndex ? 1 : -1)
                    setActiveIndex(index)
                  }}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-zinc-700 hover:bg-zinc-800"
              onClick={handleNext}
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Next</span>
            </Button>
          </div>
        </div>

      </div>
    </section>
  )
}
