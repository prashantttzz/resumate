"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { FileText } from "lucide-react"
import { useState, useEffect } from "react"

export function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState("Loading your resume...")

  useEffect(() => {
    const texts = ["Loading your resume...", "Preparing editor...", "Loading templates...", "Almost ready..."]

    let interval: NodeJS.Timeout
    let textInterval: NodeJS.Timeout

    // Progress animation
    interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 5
      })
    }, 100)

    // Text animation
    let textIndex = 0
    textInterval = setInterval(() => {
      textIndex = (textIndex + 1) % texts.length
      setLoadingText(texts[textIndex])
    }, 1500)

    return () => {
      clearInterval(interval)
      clearInterval(textInterval)
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50">
      <div className="w-full max-w-md px-4">
        <Card className="border-0 shadow-sm p-8 flex flex-col items-center justify-center text-center animate-in fade-in-50 duration-500">
          <div className="rounded-full bg-secondary p-4 mb-4">
            <FileText className="h-8 w-8 text-foreground animate-pulse" />
          </div>
          <h2 className="text-xl font-medium mb-2">Resumate</h2>
          <p className="text-muted-foreground mb-6">{loadingText}</p>
          <Progress value={progress} className="w-full h-1 mb-2" />
          <p className="text-xs text-muted-foreground">{progress}%</p>
        </Card>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-secondary/30 rounded-full animate-float"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 15}s`,
              opacity: Math.random() * 0.3 + 0.1,
            }}
          />
        ))}
      </div>
    </div>
  )
}
