"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, FileText, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function InteractiveFeature() {
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    {
      title: "Upload your existing resume",
      description: "Start by uploading your current resume or create one from scratch.",
      icon: <FileText className="h-6 w-6" />,
    },
    {
      title: "Get AI-powered suggestions",
      description:
        "Our AI analyzes your resume and suggests improvements for skills, achievements, and job descriptions.",
      icon: <Sparkles className="h-6 w-6" />,
    },
    {
      title: "Optimize for ATS",
      description: "Ensure your resume passes through Applicant Tracking Systems with our optimization tools.",
      icon: <CheckCircle className="h-6 w-6" />,
    },
  ]

  return (
    <div className="rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 md:p-8 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,255,255,0.05),transparent_70%)]"></div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3 space-y-6">
            <h3 className="text-xl font-bold">How it works</h3>

            <div className="space-y-4">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  className={`p-4 rounded-xl cursor-pointer transition-all ${
                    activeStep === index
                      ? "bg-gradient-to-r from-zinc-800 to-zinc-900 border border-zinc-700"
                      : "hover:bg-zinc-900"
                  }`}
                  onClick={() => setActiveStep(index)}
                  whileHover={{ x: activeStep === index ? 0 : 5 }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`rounded-full p-2 ${
                        activeStep === index ? "bg-white text-zinc-900" : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {step.icon}
                    </div>
                    <div>
                      <h4 className={`font-medium ${activeStep === index ? "text-white" : "text-zinc-400"}`}>
                        {step.title}
                      </h4>
                      {activeStep === index && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="text-sm text-zinc-400 mt-2"
                        >
                          {step.description}
                        </motion.p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <Button className="w-full bg-white text-zinc-900 hover:bg-zinc-200">Try it now</Button>
          </div>

          <div className="md:w-2/3 bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
                <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
                <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
              </div>
              <div className="text-xs text-zinc-500 font-medium">ResumeForge Editor</div>
            </div>

            <div className="p-6 h-[300px] relative">
              {activeStep === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center gap-4"
                >
                  <div className="w-20 h-20 rounded-full bg-zinc-800 flex items-center justify-center">
                    <FileText className="h-8 w-8 text-zinc-400" />
                  </div>
                  <p className="text-zinc-400 text-center">
                    Drag and drop your resume here
                    <br />
                    or click to browse
                  </p>
                  <Button variant="outline" className="border-zinc-700">
                    Upload Resume
                  </Button>
                </motion.div>
              )}

              {activeStep === 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="h-6 w-40 bg-zinc-800 rounded mb-2"></div>
                        <div className="h-4 w-full bg-zinc-800 rounded"></div>
                        <div className="h-4 w-full bg-zinc-800 rounded mt-1"></div>
                        <div className="h-4 w-2/3 bg-zinc-800 rounded mt-1"></div>
                      </div>
                      <div className="flex-shrink-0 bg-gradient-to-r from-zinc-800 to-zinc-700 p-3 rounded-lg">
                        <Sparkles className="h-5 w-5 text-yellow-400" />
                      </div>
                    </div>

                    <div className="border border-yellow-500/20 bg-yellow-500/5 rounded-lg p-4">
                      <p className="text-sm text-yellow-200 mb-2 font-medium">AI Suggestion:</p>
                      <p className="text-sm text-zinc-400">
                        Consider adding quantifiable achievements to strengthen this experience. For example: "Increased
                        team productivity by 25% through implementation of new workflows."
                      </p>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" size="sm" className="border-zinc-700 text-xs">
                        Ignore
                      </Button>
                      <Button size="sm" className="bg-white text-zinc-900 hover:bg-zinc-200 text-xs">
                        Apply Suggestion
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeStep === 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium">ATS Score</div>
                      <div className="text-sm font-medium text-green-400">92/100</div>
                    </div>

                    <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "92%" }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-green-500 to-green-400"
                      ></motion.div>
                    </div>

                    <div className="space-y-3 mt-4">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Keywords match job description</p>
                          <p className="text-xs text-zinc-500">Your resume includes key terms from the job posting</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Format is ATS-friendly</p>
                          <p className="text-xs text-zinc-500">Clean structure that can be parsed by ATS systems</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <div className="h-5 w-5 rounded-full border-2 border-yellow-400 flex items-center justify-center mt-0.5">
                          <div className="h-1.5 w-1.5 bg-yellow-400 rounded-full"></div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-yellow-400">Consider adding more achievements</p>
                          <p className="text-xs text-zinc-500">Focus on results and metrics to stand out</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
