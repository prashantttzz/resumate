"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Linkedin, Mail, CheckCircle, Users, Download, Zap, ArrowRight, Network } from "lucide-react"

export default function LinkedIn() {

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  }

  const features = [
    {
      icon: Download,
      title: "One-Click Import",
      description: "Import your complete LinkedIn profile instantly",
    },
    {
      icon: Users,
      title: "Network Sync",
      description: "Sync connections and recommendations seamlessly",
    },
    {
      icon: Zap,
      title: "Auto-Update",
      description: "Keep your resume current with LinkedIn changes",
    },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Animated Background Network */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 1000 1000">
          <defs>
            <pattern id="network" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="2" fill="#000" opacity="0.3" />
              <line x1="50" y1="50" x2="150" y2="50" stroke="#000" strokeWidth="1" opacity="0.2" />
              <line x1="50" y1="50" x2="50" y2="150" stroke="#000" strokeWidth="1" opacity="0.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#network)" />
        </svg>
      </div>

      <motion.div
        className="max-w-5xl mx-auto text-center relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header with LinkedIn Integration Visual */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-center gap-6 mb-8">
            {/* Resume Builder Icon */}
            <motion.div
              className="w-16 h-16 bg-white rounded-xl flex items-center justify-center"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Network className="w-8 h-8 text-black" />
            </motion.div>

            {/* Connection Line */}
            <motion.div
              className="flex items-center gap-2"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="w-12 h-0.5 bg-white" />
              <motion.div animate={{ x: [0, 10, 0] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
                <ArrowRight className="w-5 h-5 text-white" />
              </motion.div>
              <div className="w-12 h-0.5 bg-white" />
            </motion.div>

            {/* LinkedIn Icon */}
            <motion.div
              className="w-16 h-16 bg-blue-700 rounded-xl flex items-center justify-center"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Linkedin className="w-8 h-8 text-white" />
            </motion.div>
          </div>
        </motion.div>

        {/* Main Heading */}
        <motion.div variants={itemVariants} className="mb-8">
          <motion.div
            className="inline-block mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
              New Feature Coming Soon
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.9 }}
          >
            <motion.span
              className="inline-block text-main"
              initial={{ y: 80 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
            >
              LINKEDIN
            </motion.span>
            <br />
            <motion.span
              className="inline-block  bg-main bg-clip-text text-transparent"
              initial={{ y: 80 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 1.3 }}
            >
              INTEGRATION
            </motion.span>
          </motion.h1>
        </motion.div>

        {/* Subtitle */}
        <motion.div variants={itemVariants} className="mb-12">
          <motion.p
            className="text-xl md:text-2xl text-white max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.5 }}
          >
            Transform your LinkedIn profile into a stunning resume in seconds.
            <br className="hidden md:block" />
            <span className="font-semibold text-white">No more manual data entry.</span>
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto ">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group p-6 rounded-2xl bg-card border-2  flex  flex-col items-center hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.7 + index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <motion.div
                className="w-12 h-12  rounded-xl  flex items-center justify-center mb-4 bg-main text-white transition-all duration-300"
                whileHover={{ rotate: 5 }}
              >
                  <feature.icon className="w-6 h-6" />
              </motion.div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
        {/* Floating Connection Nodes */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gray-300 rounded-full opacity-40"
            style={{
              top: `${20 + Math.random() * 60}%`,
              left: `${10 + Math.random() * 80}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.4, 0.1, 0.4],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}
