"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  User,
  Bot,
  MessageSquare,
  Zap,
  RefreshCw,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ResumePreview } from "@/components/resume/resume-preview";
import { Message, ResumeData } from "@/types/resume";
import {
  useCreateNewResume,
  useGetAllResumes,
  useGetResumebyId,
  useResumeCount,
  useSaveResume,
} from "@/query/resume/query";
import { toast } from "sonner";
import Loader from "@/components/Loader";
import { ResumeNotFound } from "@/components/error";
import { motion, AnimatePresence } from "framer-motion";
import { ResumeActionModal } from "@/components/resume/ActionModal";
import { isPremium } from "@/query/user/query";
import { ShareModal } from "@/components/share-modal";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";
import { loadingStates } from "@/constants";

export default function AIResumeBuilder() {
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);  
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const { data: resumeCount = 0 } = useResumeCount();
  const { data: ispremium } = isPremium();
  const { mutate: newresume } = useCreateNewResume();
  const {
    data: availableResumes,
    isPending: isLoadingResumes,
    isError: isErrorLoadingResumes,
    refetch: refetchResumes,
  } = useGetAllResumes();
  const {
    isPending: isResumeLoading,
    data: initialResumeData,
    isError: isFetchError,
    error: fetchError,
  } = useGetResumebyId(selectedResumeId as string);
  const { mutate, isPending: isSaving, error: saveError } = useSaveResume();

  const generateUniqueId = () =>
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  useEffect(() => {
    if (!selectedResumeId && !isLoadingResumes && availableResumes) {
      if (isErrorLoadingResumes) {
        setMessages([
          {
            id: "error-load-resumes",
            type: "ai",
            content:
              "Oops! I couldn't fetch your resumes. Please try again later.",
            timestamp: new Date(),
          },
        ]);
        return;
      }
      if (availableResumes.length === 0) {
        setMessages([
          {
            id: "no-resumes",
            type: "ai",
            content:
              "Hello there! It looks like you don't have any resumes yet. Would you like to create a new one?",
            timestamp: new Date(),
          },
        ]);
        return;
      }
      const resumeListContent = (
        <div>
          <p>
            Hello! I'm Coco , you ai resume buddy. To get started, please select
            a resume:
          </p>
          <div className="flex flex-col gap-2 mt-4">
            {availableResumes.map((resume: any) => (
              <Button
                key={resume.id}
                variant="outline"
                className="justify-start"
                onClick={() => handleResumeSelection(resume.id)}
              >
                {resume.title || `Resume ${resume.id.substring(0, 5)}`} -{" "}
              </Button>
            ))}
            <Button
              variant="outline"
              className="justify-start mt-2"
              onClick={() => {
                toast.info("Feature to create new resume coming soon!");
              }}
            >
              Create New Resume
            </Button>
          </div>
        </div>
      );

      setMessages([
        {
          id: "initial-greeting",
          type: "ai",
          content: resumeListContent,
          timestamp: new Date(),
        },
      ]);
    }
  }, [
    selectedResumeId,
    isLoadingResumes,
    availableResumes,
    isErrorLoadingResumes,
  ]);
  useEffect(() => {
    if (
      selectedResumeId &&
      !isResumeLoading &&
      initialResumeData &&
      !resumeData
    ) {
      const normalizedResumeData: ResumeData = {
        id: selectedResumeId,
        slug: initialResumeData.slug || "",
        personalInfo: {
          fullName: initialResumeData.personalInfo?.fullName || "john doe",
          email: initialResumeData.personalInfo?.email || "johndoe@gmail.com",
          jobTitle:
            initialResumeData.personalInfo?.jobTitle || "software engineer",
          phone: initialResumeData.personalInfo?.phone || "8989898989",
          linkedin:
            initialResumeData.personalInfo?.linkedin || "https://linkedin.in",
          github: initialResumeData.personalInfo?.github || "",
          website: initialResumeData.personalInfo?.website || "",
          address: initialResumeData.personalInfo?.address || "address",
          summary:
            initialResumeData.personalInfo?.summary ||
            "hello i am john doe , a senior software developer this is my test summary.",
        },
        experiences: initialResumeData.experiences.map((exp: any) => ({
          id: exp.id || generateUniqueId(),
          company: exp.company || "",
          position: exp.position || "",
          startDate: exp.startDate
            ? new Date(exp.startDate).toISOString().slice(0, 7)
            : "",
          endDate: exp.endDate
            ? new Date(exp.endDate).toISOString().slice(0, 7)
            : "",
          current: exp.current || false,
          location: exp.location || "",
          description: exp.description || "",
        })),
        projects: initialResumeData.projects.map((proj: any) => ({
          id: proj.id || generateUniqueId(),
          title: proj.title || "",
          role: proj.role || "",
          link: proj.link || "",
          startDate: proj.startDate
            ? new Date(proj.startDate).toISOString().slice(0, 7)
            : "",
          endDate: proj.endDate
            ? new Date(proj.endDate).toISOString().slice(0, 7)
            : "",
          current: proj.current || false,
          description: proj.description || "",
        })),
        education: initialResumeData.education.map((edu: any) => ({
          id: edu.id || generateUniqueId(),
          institution: edu.institution || "",
          current: edu.current || false,
          degree: edu.degree || "",
          description: edu.description || "",
          startDate: edu.startDate
            ? new Date(edu.startDate).toISOString().slice(0, 7)
            : "",
          endDate: edu.endDate
            ? new Date(edu.endDate).toISOString().slice(0, 7)
            : "",
          location: edu.location || "",
        })),
        skills: initialResumeData.skills.map((skillCat: any) => ({
          id: skillCat.id || generateUniqueId(),
          name: skillCat.name || "",
          skills: skillCat.skills.map((skill: any) => ({
            id: skill.id || generateUniqueId(),
            name: skill.name || "",
            level: skill.level || "Beginner",
          })),
        })),
        customSections: initialResumeData.customSections.map(
          (customSec: any) => ({
            id: customSec.id || generateUniqueId(),
            title: customSec.title || "",
            entries: customSec.entries.map((entry: any) => ({
              id: entry.id || generateUniqueId(),
              title: entry.title || "",
              description: entry.description || "",
              date: entry.date || "",
              link: entry.link || "",
            })),
          })
        ),
        sectionOrder:
          initialResumeData.sectionOrder &&
          initialResumeData.sectionOrder.length > 0
            ? initialResumeData.sectionOrder
            : [
                { title: "Personal Information", type: "core", isActive: true },
                { title: "Experience", type: "core", isActive: false },
                { title: "Projects", type: "core", isActive: true },
                { title: "Education", type: "core", isActive: true },
                { title: "Skills", type: "core", isActive: true },
                { title: "Custom Sections", type: "custom", isActive: true },
              ],
        template: initialResumeData.template || "modern",
      };
      setResumeData(normalizedResumeData);
      const fetchInitialAIMessage = async () => {
        setIsTyping(true);
        try {
          const res = await fetch("/api/ai-builder", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              resumeData: normalizedResumeData,
              userInput: "Start conversation",
              chatHistory: [],
            }),
          });

          if (!res.ok) {
            const errorData = await res.json();
            console.error("API Error (Initial Message):", errorData);
            setMessages((prev) => [
              ...prev,
              {
                id: "error-init-ai",
                type: "ai",
                content: "Failed to load initial AI message. Please refresh.",
                timestamp: new Date(),
              },
            ]);
            return;
          }

          const { updatedResume, aiMessage } = await res.json();
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              type: "ai",
              content: aiMessage,
              timestamp: new Date(),
            },
          ]);
          setResumeData(updatedResume);
        } catch (err) {
          console.error("Chat error (Initial AI Message):", err);
          setMessages((prev) => [
            ...prev,
            {
              id: "error-connect-ai",
              type: "ai",
              content: "Failed to connect to AI. Please try again later.",
              timestamp: new Date(),
            },
          ]);
        } finally {
          setIsTyping(false);
        }
      };

      fetchInitialAIMessage();
    }
  }, [selectedResumeId, isResumeLoading, initialResumeData]);

  useEffect(() => {
    const c = messagesContainerRef.current;
    if (c) c.scrollTop = c.scrollHeight;
  }, [messages, isTyping]);

  const handleResumeSelection = (id: string) => {
    setSelectedResumeId(id);
    setMessages([]);
    setResumeData(null);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: "user",
        content: `I've selected resume with ID: ${id.substring(0, 8)}...`,
        timestamp: new Date(),
      },
    ]);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !selectedResumeId || !resumeData) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInputValue("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/ai-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeData: resumeData,
          userInput: newMessage.content,
          chatHistory: updatedMessages.map((msg) => ({
            role: msg.type === "user" ? "user" : "model",
            parts: [{ text: msg.content }],
          })),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("API Error:", errorData);
        throw new Error(errorData.message || "Failed to get response from AI.");
      }

      const { updatedResume, aiMessage } = await res.json();
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: aiMessage,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
      setResumeData(updatedResume);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: "Oops! Something went wrong. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickPrompts: string[] = ["job description", "overall enhance resume"];

  const handleSaveResumeClick = () => {
    if (!resumeData || !selectedResumeId) {
      toast.error("No resume selected or data available to save.");
      return;
    }
    setIsActionModalOpen(true);
  };

  const handleConfirmCreateCopy = (newTitle: string) => {
    if (!resumeData) return;
    if (!ispremium?.isPremium && resumeCount! >= 3) {
      toast.error(
        "Free users can create up to 3 resumes only. Upgrade to premium for unlimited!"
      );
      return;
    }
    const toastId = toast.loading("Creating resume entry...");
    newresume(newTitle, {
      onSuccess: (newlyCreatedResumeId: string) => {
        const resumeCopy = {
          ...resumeData,
          slug: "",
          id: newlyCreatedResumeId,
        };
        mutate(
          { resume: resumeCopy, resumeId: newlyCreatedResumeId },
          {
            onSuccess: () => {
              toast.success(
                `Resume "${newTitle}" created and saved successfully!`,
                { id: toastId }
              );
              setSelectedResumeId(newlyCreatedResumeId);
              setResumeData(resumeCopy);
              setMessages([
                {
                  id: Date.now().toString(),
                  type: "ai",
                  content: `Great! I've created a new copy of your resume titled "${newTitle}" with the latest changes.`,
                  timestamp: new Date(),
                },
              ]);
            },
            onError: (err) => {
              console.error("Save new resume data error:", err);
              toast.error(
                saveError?.message || "Failed to save data to new resume copy.",
                { id: toastId }
              );
            },
          }
        );
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to create new resume entry.", {
          id: toastId,
        });
      },
    });
  };
  const handleConfirmUpdateExisting = () => {
    if (!resumeData || !selectedResumeId) return;
    mutate(
      { resume: resumeData, resumeId: selectedResumeId },
      {
        onSuccess: () => {
          toast.success("Existing resume updated successfully!");
          setMessages([
            {
              id: Date.now().toString(),
              type: "ai",
              content: "Your existing resume has been successfully updated!",
              timestamp: new Date(),
            },
          ]);
        },
        onError: (err) => {
          console.error("Update existing error:", err);
          toast.error(
            saveError?.message || "Failed to update existing resume."
          );
        },
      }
    );
  };

  const handleRefreshResumes = () => {
    setSelectedResumeId(null);
    setResumeData(null);
    setMessages([]);
    refetchResumes();
  };
  if (!selectedResumeId && isLoadingResumes) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-background flex items-center justify-center text-white text-lg"
      >
        <Loader /> Loading available resumes...
      </motion.div>
    );
  }
  if (selectedResumeId && isResumeLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-background flex items-center justify-center text-white text-lg"
      >
        <Loader />
      </motion.div>
    );
  }
  if (selectedResumeId && isFetchError) {
    console.error("Error fetching selected resume:", fetchError);
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ResumeNotFound variant="error" />
      </motion.div>
    );
  }
  if (selectedResumeId && !resumeData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-background flex items-center justify-center text-white text-lg"
      >
        <Loader /> Initializing AI builder for your resume...
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-background md:p-5 md:flex md:justify-evenly w-full ">
      {isDownloading ? (
        <MultiStepLoader
          loadingStates={loadingStates}
          loading={isDownloading}
        />
      ) : (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={resumeData ? "chat-with-preview" : "chat-only"}
              initial={{ opacity: 0, x: resumeData ? -50 : 0 }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{ opacity: 0, x: resumeData ? -50 : 0 }}
              transition={{ duration: 0.5 }}
              className={`flex flex-col bg-card rounded-2xl h-[calc(100vh-80px)]  w-full `}
            >
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-100">Coco</h2>
                      <p className="text-sm text-gray-200">
                        {selectedResumeId
                          ? "Let's make your resume ATS-friendly!"
                          : "Select a resume to begin."}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRefreshResumes}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div
                className="flex-1 overflow-y-auto p-6 space-y-6"
                ref={messagesContainerRef}
              >
                <TooltipProvider>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.type === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`flex items-start gap-4 max-w-[80%] ${
                          message.type === "user" ? "flex-row-reverse" : ""
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            message.type === "user"
                              ? "bg-white text-black"
                              : "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg"
                          }`}
                        >
                          {message.type === "user" ? (
                            <User className="w-4 h-4 " />
                          ) : (
                            <Bot className="w-4 h-4" />
                          )}
                        </div>

                        <div
                          className={`rounded-2xl px-5 py-4 transition-all hover:shadow-md ${
                            message.type === "ai"
                              ? "bg-accent text-white"
                              : "bg-gray-100 text-gray-900 hover:bg-gray-200 cursor-pointer border border-gray-200"
                          }`}
                        >
                          {typeof message.content === "string" ? (
                            <p className="text-sm leading-relaxed">
                              {message.content}
                            </p>
                          ) : (
                            <div className="text-sm leading-relaxed">
                              {message.content}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex items-start gap-4 max-w-[80%]">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-emerald-500 to-emerald -600 text-white">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div className="rounded-2xl px-5 py-4 border">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </TooltipProvider>
              </div>

              {selectedResumeId && (
                <div className="px-6 py-3 border-t border-gray-700 ">
                  <div className="flex gap-2 flex-wrap">
                    {quickPrompts.map((prompt, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => setInputValue(prompt)}
                      >
                        <Zap className="w-3 h-3 mr-1" />
                        {prompt}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-6 border-t">
                <div className="flex items-center gap-3 rounded-2xl p-3 border shadow-sm">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={
                      selectedResumeId
                        ? "Type your answer here..."
                        : "Please select a resume first..."
                    }
                    className="flex-1 bg-transparent border-none focus-visible:ring-0 text-white placeholder:text-white/50"
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    disabled={!selectedResumeId || isTyping}
                  />
                  <Button
                    size="sm"
                    onClick={handleSendMessage}
                    variant="ghost"
                    className="bg-card cursor-pointer text-white rounded-xl px-4"
                    disabled={
                      !inputValue.trim() || !selectedResumeId || isTyping
                    }
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>

            {resumeData && (
              <motion.div
                key={selectedResumeId}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
                className="w-[60%] max-w-[800px] space-y-4 ml-10 hidden md:block"
              >
                <div className="flex items-center gap-3 w-full justify-between">
                  <div className="flex gap-2 items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-white font-semibold">
                      Live Preview
                    </span>
                  </div>
                  <div className="space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={handleSaveResumeClick}
                      disabled={!selectedResumeId}
                    >
                      {isSaving ? (
                        <Loader />
                      ) : (
                        <div className="flex gap-1 items-center">
                          <Save className="w-4 h-4" />
                          Save
                        </div>
                      )}
                    </Button>
                    <Button variant="outline" size="sm" className="hover-lift">
                      <ShareModal
                        setIsDownloading={setIsDownloading}
                        resumeId={selectedResumeId!}
                        resumeName={initialResumeData?.title || "resume"}
                      />
                    </Button>
                  </div>
                </div>
                <div className="caret-transparent">
                  <ResumePreview
                    template={resumeData.template}
                    resumeData={resumeData}
                    sectionOrder={resumeData.sectionOrder}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <ResumeActionModal
            isOpen={isActionModalOpen}
            onClose={() => setIsActionModalOpen(false)}
            onConfirmCreateCopy={handleConfirmCreateCopy}
            onConfirmUpdateExisting={handleConfirmUpdateExisting}
          />
        </>
      )}
    </div>
  );
}
