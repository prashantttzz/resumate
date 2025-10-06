"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Download, FileText, CheckCircle, Wifi, User, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Component() {
  const [isDownloading, setIsDownloading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [downloadSpeed, setDownloadSpeed] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  // Simulate resume download
  useEffect(() => {
    if (!isDownloading || isComplete) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 4 + 1 // Faster for smaller file

        // Simulate varying download speeds (faster for resume)
        setDownloadSpeed(Math.random() * 1.5 + 0.8) // 0.8-2.3 MB/s

        // Calculate time remaining
        const remaining = (100 - newProgress) / 8 // Faster completion
        setTimeRemaining(Math.max(0, remaining))

        if (newProgress >= 100) {
          setIsComplete(true)
          return 100
        }
        return newProgress
      })
    }, 150) // Faster updates

    return () => clearInterval(interval)
  }, [isDownloading, isComplete])

  const startDownload = () => {
    setIsDownloading(true)
    setProgress(0)
    setIsComplete(false)
  }

  const resetDownload = () => {
    setIsDownloading(false)
    setProgress(0)
    setIsComplete(false)
    setTimeRemaining(0)
  }

  const formatTime = (seconds: number) => {
    if (seconds < 60) {
      return `${Math.ceil(seconds)}s`
    }
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const formatFileSize = (progress: number) => {
    const downloaded = (progress / 100) * 2.4 // 2.4 MB resume file
    return `${downloaded.toFixed(1)} MB / 2.4 MB`
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 to-blue-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="p-6">
          <div className="text-center space-y-6">
            {/* Header with resume info */}
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <div className="relative">
                  <FileText className="h-8 w-8 text-emerald-600" />
                  <User className="h-4 w-4 text-emerald-500 absolute -top-1 -right-1 bg-white rounded-full p-0.5" />
                </div>
                <div className="text-left">
                  <h2 className="text-xl font-semibold text-gray-900">John_Doe_Resume.pdf</h2>
                  <p className="text-sm text-gray-500">Professional Resume</p>
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!isDownloading && !isComplete && (
                <motion.div
                  key="start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Briefcase className="h-5 w-5 text-emerald-600" />
                      <span className="font-medium text-emerald-800">Resume Ready</span>
                    </div>
                    <p className="text-emerald-700 text-sm">
                      Download my latest professional resume with updated experience and skills
                    </p>
                  </div>
                  <Button onClick={startDownload} className="w-full bg-emerald-600 hover:bg-emerald-700">
                    <Download className="h-4 w-4 mr-2" />
                    Download Resume
                  </Button>
                </motion.div>
              )}

              {isDownloading && !isComplete && (
                <motion.div
                  key="downloading"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Animated Download Icon */}
                  <div className="relative">
                    <motion.div
                      animate={{
                        y: [0, -8, 0],
                        rotate: [0, 3, -3, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                      className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full relative"
                    >
                      <FileText className="h-8 w-8 text-emerald-600" />
                      <motion.div
                        className="absolute inset-0 border-2 border-emerald-300 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 3,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                      />
                    </motion.div>

                    {/* Document pages floating effect */}
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-3 h-4 bg-emerald-400 rounded-sm"
                        animate={{
                          y: [0, -25, -50],
                          x: [0, Math.sin(i) * 15, Math.sin(i) * 30],
                          opacity: [1, 0.7, 0],
                          rotate: [0, 10, 20],
                        }}
                        transition={{
                          duration: 2.5,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: i * 0.4,
                          ease: "easeOut",
                        }}
                        style={{
                          left: "50%",
                          top: "50%",
                          marginLeft: "-6px",
                          marginTop: "-8px",
                        }}
                      />
                    ))}
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Downloading resume...</span>
                      <span className="font-medium">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full relative"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        {/* Shimmer effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                          animate={{ x: ["-100%", "100%"] }}
                          transition={{
                            duration: 1.5,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                          }}
                        />
                      </motion.div>
                    </div>
                  </div>

                  {/* Download Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                      <div className="flex items-center justify-center space-x-1 text-emerald-700 mb-1">
                        <Wifi className="h-4 w-4" />
                        <span>Speed</span>
                      </div>
                      <div className="font-semibold text-emerald-900">{downloadSpeed.toFixed(1)} MB/s</div>
                    </div>
                    <div className="text-center p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                      <div className="text-emerald-700 mb-1">Time Left</div>
                      <div className="font-semibold text-emerald-900">{formatTime(timeRemaining)}</div>
                    </div>
                  </div>

                  {/* File Size Info */}
                  <div className="text-center text-sm text-gray-600">{formatFileSize(progress)}</div>

                  {/* Resume sections loading animation */}
                  <div className="space-y-2">
                    <div className="text-xs text-gray-500 text-center">Loading resume sections...</div>
                    <div className="flex justify-center space-x-2">
                      {["Experience", "Skills", "Education", "Projects"].map((section, i) => (
                        <motion.div
                          key={section}
                          className="px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700"
                          animate={{
                            opacity: progress > i * 25 ? 1 : 0.3,
                            scale: progress > i * 25 ? 1 : 0.9,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          {section}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {isComplete && (
                <motion.div
                  key="complete"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="space-y-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                      delay: 0.2,
                    }}
                    className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full"
                  >
                    <CheckCircle className="h-8 w-8 text-emerald-600" />
                  </motion.div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Resume Downloaded!</h3>
                    <p className="text-gray-600 text-sm">
                      Thank you for your interest. The resume is now saved to your device.
                    </p>
                  </div>

                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <p className="text-emerald-800 text-sm font-medium">📄 Ready to review</p>
                    <p className="text-emerald-700 text-xs mt-1">Feel free to reach out if you have any questions!</p>
                  </div>

                  <Button
                    onClick={resetDownload}
                    variant="outline"
                    className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                  >
                    Download Again
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
