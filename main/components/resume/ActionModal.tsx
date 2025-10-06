"use client";

import React, { useState, useEffect } from "react"; 
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 
import { Copy, Edit, X } from "lucide-react";

interface ResumeActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmCreateCopy: (newTitle: string) => void;
  onConfirmUpdateExisting: () => void;
}

export function ResumeActionModal({
  isOpen,
  onClose,
  onConfirmCreateCopy,
  onConfirmUpdateExisting,
}: ResumeActionModalProps) {
  const [showTitleInput, setShowTitleInput] = useState(false);
  const [newResumeTitle, setNewResumeTitle] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setShowTitleInput(false);
      setNewResumeTitle("");
    }
  }, [isOpen]);
  if (!isOpen) return null;

  const backdropVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const modalVariants = {
    hidden: {
      y: "-100vh",
      opacity: 0,
    },
    visible: {
      y: "0",
      opacity: 1,
      transition: { delay: 0.1, type: "spring" as const, stiffness: 100 },
    },
    exit: {
      y: "100vh",
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  const handleCreateCopyClick = () => {
    setShowTitleInput(true);
  };

  const handleConfirmTitle = () => {
    if (newResumeTitle.trim()) {
      onConfirmCreateCopy(newResumeTitle.trim());
      setNewResumeTitle("");
      setShowTitleInput(false);
      onClose();
    } else {
      alert("Please enter a title for the new resume copy."); // Consider using a toast here
    }
  };

  return (
    <AnimatePresence>
      {/* The AnimatePresence and motion.div inside it handle the rendering only when isOpen is true */}
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 backdrop-blur-sm"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="bg-card text-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {!showTitleInput ? (
              <>
                <h3 className="text-2xl font-semibold mb-4 text-gray-100">
                  Save Resume Changes
                </h3>
                <p className="text-gray-300 mb-6">
                  How would you like to apply the AI-generated enhancements?
                </p>

                <div className="flex flex-col gap-4">
                  <Button
                    className="w-full py-3 px-6 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-200 text-md flex items-center justify-center gap-2 text-white shadow-lg"
                    onClick={handleCreateCopyClick}
                  >
                    <Copy className="w-5 h-5" /> Create New Copy
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full py-3 px-6 rounded-xl text-gray-100 border-gray-700 hover:bg-gray-700 transition-all duration-200 text-md font-semibold flex items-center justify-center gap-2"
                    onClick={() => {
                      onConfirmUpdateExisting();
                      onClose();
                    }}
                  >
                    <Edit className="w-5 h-5" /> Update Existing Resume
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-semibold mb-4 text-gray-100">
                  New Resume Title
                </h3>
                <p className="text-gray-300 mb-6">
                  Please provide a title for your new resume copy.
                </p>
                <div className="mb-6">
                  <Input
                    type="text"
                    placeholder="e.g., My Enhanced Software Engineer Resume"
                    className="w-full bg-gray-800 border-gray-700 text-white rounded-md p-3 focus:ring-blue-500 focus:border-blue-500"
                    value={newResumeTitle}
                    onChange={(e) => setNewResumeTitle(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleConfirmTitle()}
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    className="text-gray-100 border-gray-700 hover:bg-gray-700"
                    onClick={() => setShowTitleInput(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                    onClick={handleConfirmTitle}
                  >
                    Confirm
                  </Button>
                </div>
              </>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-100"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}