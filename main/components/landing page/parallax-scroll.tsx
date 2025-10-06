"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"

const templates = [
  { id: 1, name: "Professional", category: "Corporate" },
  { id: 2, name: "Creative", category: "Design" },
  { id: 3, name: "Modern", category: "Tech" },
  { id: 4, name: "Minimal", category: "All-purpose" },
  { id: 5, name: "Executive", category: "Management" },
  { id: 6, name: "Bold", category: "Marketing" },
]

export default function ParallaxScroll() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  return (
    <div ref={containerRef} className="relative py-10">
      <div className="flex gap-6 overflow-hidden">
        <div className="flex gap-32 animate-scroll-left">
          {templates.slice(0, 3).map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              progress={scrollYProgress}
              direction="left"
              index={template.id}
            />
          ))}
        </div>
      </div>

      <div className="flex gap-6 overflow-hidden mt-6">
        <div className="flex gap-6 animate-scroll-right">
          {templates.slice(3).map((template, i) => (
            <TemplateCard
              key={template.id}
              template={template}
              progress={scrollYProgress}
              direction="right"
              index={i}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

interface TemplateCardProps {
  template: { id: number; name: string; category: string }
  progress: any
  direction: "left" | "right"
  index: number
}

function TemplateCard({ template, progress, direction, index }: TemplateCardProps) {
  const x = useTransform(progress, [0, 1], direction === "left" ? [0, -100 * (index + 1)] : [0, 100 * (index + 1)])

  return (
    <motion.div
      style={{ x }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.2 }}
      className="shrink-0 relative group"
    >
      <div className="w-[280px] h-[400px] rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900">
        <Image
          src={`/fake.png`}
          alt={template.name}
          width={280}
          height={400}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
          <div>
            <h3 className="font-bold text-lg">{template.name}</h3>
            <p className="text-sm text-zinc-300">{template.category}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
