"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { categories, templates } from "@/constants";
import {
  useCreateNewResume,
  useGetAllResumes,
  useResumeCount,
} from "@/query/resume/query";
import Loader from "@/components/Loader";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { isPremium } from "@/query/user/query";

export default function Component() {
  const [selectedCategory, setSelectedCategory] = useState("All Templates");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showResumeSelection, setShowResumeSelection] = useState(false);
  const [showNameDialog, setShowNameDialog] = useState(false);
  const { mutate: resumeMutate, isPending: resumePending } =
    useCreateNewResume();
  const [resumeName, setResumeName] = useState("");
  const { data: existingResumes, isPending } = useGetAllResumes();
  const { data: resumeCount = 0 } = useResumeCount();
  const { data: ispremium } = isPremium();
  const maxFreeResumes = 3;
  const router = useRouter();

  const filteredTemplates = templates.filter(
    (template) =>
      selectedCategory === "All Templates" ||
      template.categories.includes(selectedCategory)
  );

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template);
  };

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      setShowResumeSelection(true);
    }
  };

  const handleApplyToExisting = (resumeId: string) => {
    router.push(`/resume/${resumeId}?template=${selectedTemplate}`);
  };

  const handleCreateNew = () => {
    setShowResumeSelection(false);
    setShowNameDialog(true);
    setResumeName("");
  };

  const handleCreateWithName = () => {
    console.log("hiii");
    if (!resumeName.trim()) {
      toast.error("Resume resumeName can't be empty");
      return;
    }
    if (!ispremium?.isPremium && resumeCount! >= maxFreeResumes) {
      toast.error(
        "Free users can create up to 3 resumes only. Upgrade to premium for unlimited!"
      );
      return;
    }
    const toastId = toast.loading("Creating resume...");
    resumeMutate(resumeName, {
      onSuccess: (resumeId: string) => {
        toast.success("Resume created!", { id: toastId });
        router.push(`/resume/${resumeId}`);
      },
      onError: (error: any) => {
        toast.error(error?.message || "Something went wrong", { id: toastId });
      },
    });
  };
  if (!existingResumes) {
    return;
  }
  return (
    <div className="min-h-screen">
      <div className="">
        {/* Title Section */}
        <div className="mb-8">
          <h1 className="text-3xl text-main font-bold mb-2">Resume Templates</h1>
          <p className="text-white-400">
            Browse and select from our collection of professional resume
            templates
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "ghost"}
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap ${
                selectedCategory === category
                  ? "bg-white text-black hover:bg-gray-200"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8 ">
          {filteredTemplates.map((template) => (
            <Card
              key={template.id}
              className={`cursor-pointer transition-all duration-300  hover:shadow-lg hover:transform hover:scale-[1.02] ${
                selectedTemplate === template.id
                  ? "ring-2 ring-main border-main shadow-blue-500/20 shadow-lg"
                  : ""
              }`}
              onClick={() => handleTemplateSelect(template.id)}
            >
              <CardContent className="p-0 relative">
                {/* Template Preview */}
                <div className="aspect-[3/4] bg-white rounded-t-lg overflow-hidden">
                  <img
                    src={template.preview || "/placeholder.svg"}
                    alt={template.name}
                    className="w-full h-full object-containx"
                  />
                </div>

                {/* Selection Indicator */}
                {selectedTemplate === template.id && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-main rounded-full flex items-center justify-center animate-in zoom-in-50 duration-200">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                )}

                {/* Template Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">
                    {template.name}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {template.description}
                  </p>

                  {/* Tags and Preview Button */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {template.categories.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="bg-gray-800 text-main text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Floating Use Selected Template Button */}
        {selectedTemplate && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 duration-300">
            <div className="bg-background rounded-full px-6 py-3 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={
                        templates.find((t) => t.id === selectedTemplate)
                          ?.preview || "/placeholder.svg"
                      }
                      alt="Selected template"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-medium text-sm">
                      {templates.find((t) => t.id === selectedTemplate)?.name}
                    </p>
                    <p className="text-gray-400 text-xs">Template selected</p>
                  </div>
                </div>
                <Button
                  onClick={handleUseTemplate}
                  className="bg-gradient-to-r from-main to-main hover:from-main hover:to-main text-white font-medium px-6 py-2 rounded-full transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Use This Template
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Resume Selection Dialog */}
        <Dialog
          open={showResumeSelection}
          onOpenChange={setShowResumeSelection}
        >
          <DialogContent className="">
            <DialogHeader>
              <DialogTitle className="text-white">
                Choose Resume Option
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {existingResumes.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-white">
                    Apply to Existing Resume
                  </h3>
                  <div className="space-y-2">
                    {isPending ? (
                      <Loader />
                    ) : (
                      existingResumes.map((resume) => (
                        <div
                          key={resume.id}
                          className="flex items-center justify-between p-3 border-gray-500  border-2 rounded-lg cursor-pointer"
                          onClick={() => handleApplyToExisting(resume.id)}
                        >
                          <div>
                            <p className="font-medium text-white">
                              {resume.title}
                            </p>
                            <p className="text-sm text-gray-400">
                              Last modified:{" "}
                              {formatDate(resume.updatedAt.toISOString())}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              <div className="border-t border-gray-700 pt-4">
                <Button
                  onClick={handleCreateNew}
                  className="w-full bg-white text-black hover:bg-gray-200"
                >
                  Create New Resume with This Template
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Create New Resume Name Dialog */}
        <Dialog open={showNameDialog} onOpenChange={setShowNameDialog}>
          <DialogContent className=" max-w-md">
            <DialogHeader>
              <DialogTitle className="text-white text-xl font-semibold">
                Create New Resume
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-main to-main rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <p className="text-gray-300 text-sm">
                  You're about to create a new resume using the{" "}
                  <span className="font-semibold text-white">
                    {templates.find((t) => t.id === selectedTemplate)?.name}
                  </span>{" "}
                  template
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="resume-name" className="text-white font-medium">
                  Resume Name
                </Label>
                <Input
                  id="resume-name"
                  type="text"
                  placeholder="e.g., Software Engineer Resume"
                  value={resumeName}
                  onChange={(e) => setResumeName(e.target.value)}
                  className=" border-gray-600 text-white placeholder-gray-400  transition-all duration-200"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowNameDialog(false)}
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200"
                  disabled={resumePending}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateWithName}
                  disabled={!resumeName.trim() || resumePending}
                  className="flex-1 bg-gradient-to-r from-main to-main hover:from-main hover:to-main text-white font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {resumePending ? (
                    <div className="flex items-center gap-2">
                      <Loader />
                    </div>
                  ) : (
                    "Create Resume"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
