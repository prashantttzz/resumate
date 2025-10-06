import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { Providers } from "@/providers/queryProvider"
import SessionProvider from "@/providers/SessionProvider"
import SmoothScroll from "@/providers/SmoothScroll"

  const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
})

export const metadata = {
  title: "Resumate - Create Professional Resumes That Get You Hired",
  description:
    "Our AI-powered resume builder helps you create professional, ATS-optimized resumes in minutes. Stand out and get more interviews.",
    generator: 'v0.dev',
   icons: {
    icon: '/logo.png', // you can also use png or multiple sizes
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning >
      <body className={`${inter.className} antialiased scrollbar-hide scrollbar-hidden `}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <SessionProvider>
          <Providers>
            <SmoothScroll>
          {children}
            </SmoothScroll>
          </Providers>
          </SessionProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
