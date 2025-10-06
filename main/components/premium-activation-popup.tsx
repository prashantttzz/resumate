"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X, Crown, Star, Clock } from "lucide-react";

interface PremiumActivationPopupProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Component({
  isOpen = false,
  onClose,
}: PremiumActivationPopupProps) {
  const [countdown, setCountdown] = useState(180); // 3 minutes in seconds

  useEffect(() => {
    if (isOpen && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isOpen, countdown]);

  const handleClose = () => {
    onClose?.();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const premiumFeatures = [
    "Unlimited resume templates",
    "AI-powered content suggestions",
    "LinkedIn integration",
    "Priority customer support",
  ];

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const checkmarkVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: 0.3,
      },
    },
  };

  const crownVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
        delay: 0.6,
      },
    },
  };

  const celebrationPulse = {
    scale: [1, 1.05, 1],
    transition: {
      duration: 0.6,
      repeat: 2,
      delay: 0.8,
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 w-full"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={handleClose}
        >
                <motion.div
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full relative overflow-hidden"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <motion.button
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200 z-10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-4 h-4 text-gray-600" />
            </motion.button>

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000000' fillOpacity='1'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
              />
            </div>

            <div className="p-8 text-center relative">
              {/* Success Icon with Crown */}
              <motion.div className="relative mb-6" variants={itemVariants}>
                <motion.div
                  className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto relative"
                  variants={checkmarkVariants}
                  transition={{ duration: 0.3, delay: 0.8 }}
                >
                  <CheckCircle className="w-12 h-12 text-green-600" />
                  <motion.div
                    className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center"
                    variants={crownVariants}
                    transition={{ duration: 0.5, delay: 1 }}
                  >
                    <Crown className="w-4 h-4 text-yellow-800" />
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Main Message */}
              <motion.div variants={itemVariants} className="mb-6">
                <motion.h2
                  className="text-2xl font-bold text-gray-900 mb-2"
                  transition={{ duration: 0.4, delay: 1.2 }}
                >
                  Payment Successful! 🎉
                </motion.h2>
                <p className="text-gray-600 leading-relaxed">
                  Congratulations! Your premium subscription has been activated.
                </p>
              </motion.div>

              {/* Activation Timer */}
              <motion.div
                variants={itemVariants}
                className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100"
              >
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Premium features activating in
                  </span>
                </div>
                <motion.div
                  className="text-2xl font-bold text-black"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                >
                  {formatTime(countdown)}
                </motion.div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                  <motion.div
                    className="bg-gradient-to-r from-gray-600 to-black h-2 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${((180 - countdown) / 180) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </motion.div>

              {/* Premium Features Preview */}
              <motion.div variants={itemVariants} className="mb-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm font-semibold text-gray-700">
                    What's included in Premium
                  </span>
                </div>
                <div className="space-y-2">
                  {premiumFeatures.map((feature, index) => (
                    <motion.div
                      key={feature}
                      className="flex items-center gap-3 text-sm text-gray-600"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                      {feature}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div variants={itemVariants} className="space-y-3">
                <motion.button
                  onClick={handleClose}
                  className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                >
                  Continue with current workflow
                </motion.button>
              </motion.div>

              {/* Enhanced Floating Elements */}
              <motion.div
                className="absolute top-16 left-8 w-2 h-2 bg-yellow-400 rounded-full"
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.7, 0.3, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute bottom-20 right-8 w-3 h-3 bg-green-400 rounded-full"
                animate={{
                  y: [0, 10, 0],
                  opacity: [0.6, 0.2, 0.6],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: 1,
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
