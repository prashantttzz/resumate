"use client";
import { motion } from "framer-motion";
import { ChevronRight, FileText, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedStats from "@/components/landing page/animated-stats";
import FeatureCard from "@/components/landing page/feature-card";
import HeroAnimation from "@/components/landing page/hero-animation";
import ParallaxScroll from "@/components/landing page/parallax-scroll";
import PlanSelector from "@/components/landing page/plan-selector";
import TestimonialSection from "@/components/landing page/testimonial-section";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import Link from "next/link";
import { useSession } from "next-auth/react";
import CtaSection from "@/components/landing page/cta-section";
import MobileMenu from "@/components/landing page/mobile-menu";
import Loader from "@/components/Loader";
import Image from "next/image";

export default function LandingPage() {
  const { status } = useSession();
  if (status === "loading") {
    return <Loader />;
  }
  if (!status) {
    return;
  }
  return (
    <div className="relative min-h-screen bg-zinc-950 text-white flex flex-col  md:items-center">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.05),transparent_70%)] pointer-events-none"></div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-zinc-950/80 border-b border-zinc-800 flex  items-center justify-center">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Image
              width={1000}
              height={1000}
              alt="logo"
              src={"/logo.png"}
              className="h-10 w-10"
            />{" "}
            <span className="text-xl font-bold tracking-tight ">ResuMate</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#templates"
              className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
            >
              Templates
            </a>
            <a
              href="#testimonials"
              className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
            >
              Testimonials
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
            >
              Pricing
            </a>
            <Button
              variant="ghost"
              className="text-zinc-300 hover:text-white hover:bg-zinc-800"
            >
              <Link href={"/login"}>Sign In</Link>
            </Button>
            <Button className="bg-white text-zinc-900 hover:bg-zinc-200">
              <Link href={"/signup"}>Get Started</Link>
            </Button>
          </nav>
        </div>
        <MobileMenu />
      </header>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ duration: 2 }}
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ duration: 2, delay: 0.5 }}
              className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl"
            />
          </div>

          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col space-y-8"
              >
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-zinc-800 to-zinc-900 rounded-full px-3 py-1 border border-zinc-700 w-fit">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }}
                    className="text-yellow-400"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  </motion.div>
                  <span className="text-sm font-medium text-zinc-300">
                    Trusted by professionals
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  {" "}
                  Create a resume that gets you hired
                </h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="text-lg md:text-xl text-zinc-400 max-w-lg"
                >
                  Our <span className="text-white font-medium">AI-powered</span>{" "}
                  resume builder helps you create professional, ATS-optimized
                  resumes in minutes. Stand out and get more interviews.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-white to-zinc-200 text-zinc-900 hover:from-zinc-200 hover:to-zinc-300 text-base font-medium"
                  >
                    {status === "authenticated" ? (
                      <Link href={"/dashboard"}>Create your resume</Link>
                    ) : (
                      <Link
                        href={"/login"}
                        prefetch={false}
                        className="flex gap-3  items-center justify-center"
                      >
                        Create Your Resume{" "}
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                    )}
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="flex flex-wrap gap-4 text-sm text-zinc-400"
                >
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-400" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-400" />
                    <span>ATS-optimized templates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-400" />
                    <span>AI-powered suggestions</span>
                  </div>
                </motion.div>
              </motion.div>

              <div className="relative flex  justify-center">
                <HeroAnimation />
              </div>
            </div>
            <div className="w-full mt-32">
              <AnimatedStats />
            </div>{" "}
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="py-20 md:py-32 bg-gradient-to-b from-zinc-950 to-zinc-900 relative"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03),transparent_70%)]"></div>
          <div className="container px-4 md:px-6 relative">
            <div className="text-center mb-16">
              <AnimatedShinyText className="inline-flex items-center justify-center px-4 mb-2 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400 border-2 rounded-2xl">
                <span>✨ features</span>
              </AnimatedShinyText>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight max-w-3xl mx-auto ">
                Everything you need to build a standout resume
              </h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mt-4 text-zinc-400 max-w-2xl mx-auto"
              >
                Our platform combines advanced technology with expert design to
                help you create professional resumes that get noticed by
                employers and pass through ATS systems.
              </motion.p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                title="AI-Powered Content"
                description="Get tailored suggestions for skills, achievements, and job descriptions based on your industry."
                icon="sparkles"
                delay={0.1}
              />
              <FeatureCard
                title="ATS-Optimized Templates"
                description="Our templates are designed to pass through Applicant Tracking Systems with ease."
                icon="check-circle"
                delay={0.2}
              />
              <FeatureCard
                title="Real-time Analytics"
                description="Track how your resume performs with detailed insights on views and engagement."
                icon="bar-chart"
                delay={0.3}
              />
              <FeatureCard
                title="Expert-Designed Templates"
                description="Choose from dozens of professionally designed templates for every career path."
                icon="layout"
                delay={0.4}
              />
              <FeatureCard
                title="One-Click Export"
                description="Download your resume in multiple formats including PDF, DOCX, and TXT."
                icon="download"
                delay={0.5}
              />
              <FeatureCard
                title="Unlimited Edits"
                description="Update your resume anytime with our easy-to-use editor and save multiple versions."
                icon="edit"
                delay={0.6}
              />
            </div>
          </div>
        </section>

        {/* Templates Section */}
        <section id="templates" className="py-20 md:py-32 relative">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <AnimatedShinyText className="inline-flex items-center justify-center px-4 mb-2 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400 border-2 rounded-2xl">
                <span>✨ Templates</span>
              </AnimatedShinyText>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Professional templates for every career
              </h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-4 text-zinc-400 max-w-2xl mx-auto"
              >
                Choose from our extensive library of professionally designed
                templates that highlight your unique strengths.
              </motion.p>
            </div>

            <ParallaxScroll />
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials">
          <TestimonialSection />
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 md:py-32 bg-zinc-900 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03),transparent_70%)]"></div>
          <div className="container px-4 md:px-6 relative">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="inline-block rounded-full bg-zinc-800 text-main px-3 py-1 text-sm mb-4"
              >
                Pricing
              </motion.div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Simple, transparent pricing
              </h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-4 text-zinc-400 max-w-2xl mx-auto"
              >
                Choose the plan that fits your career needs.
              </motion.p>
            </div>

            <PlanSelector />
          </div>
        </section>

        <CtaSection />
      </main>

      <footer className="border-t border-zinc-800 py-12 bg-zinc-950">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-6 w-6 text-white" />
                <span className="text-xl font-bold tracking-tight">
                  ResuMate
                </span>
              </div>
              <p className="text-zinc-400 text-sm">
                Create professional resumes that get you hired.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li>
                  <a
                    href="#features"
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#templates"
                    className="hover:text-white transition-colors"
                  >
                    Templates
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="hover:text-white transition-colors"
                  >
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Career Tips
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-zinc-800 text-center text-sm text-zinc-500">
            © {new Date().getFullYear()} ResuMate. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
