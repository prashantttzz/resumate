"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ResumePreview } from "@/components/resume/resume-preview";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  FileText,
  Settings,
  LoaderCircle,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { TemplateBrowser } from "@/components/resume/template-browser";
import {
  SectionReorder,
  type ResumeSection,
} from "@/components/resume/section-reorder";
import { EditorSections } from "./editor-section";
import { toast } from "sonner";
import { useSaveResume } from "@/query/resume/query";
import { CustomSections, ResumeData, SectionType } from "@/types/resume";
import { CustomSectionBuilder } from "./custom-section-builder";
import { ResumeNotFound } from "../error";
import { ShareModal } from "../share-modal";
import { loadingStates, templates } from "@/constants";
import { useSearchParams } from "next/navigation";
import { MultiStepLoader } from "../ui/multi-step-loader";

export function ResumeEditor({
  data,
  id,
  title,
  githubProfile,
}: {
  data: any;
  id: string;
  title: string;
  githubProfile: any;
}) {
  const { mutate, isPending, isError, error } = useSaveResume();
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionType>("personal");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const searchParams = useSearchParams();
  if (!data) {
    return <ResumeNotFound variant="error" />;
  }
  const [selectedTemplate, setSelectedTemplate] = useState(() => {
    const param = searchParams.get("template");
    return param || data.template;
  });
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    const storageKey = `resumeData-${id}`;
    const savedData = sessionStorage.getItem(storageKey);
    if (savedData) {
      return JSON.parse(savedData);
    } else {
      return {
        id: id,
        slug: data.slug,
        personalInfo: {
          fullName:
            data.personalInfo?.fullName || githubProfile.personalInfo.fullName,
          email:
            data.personalInfo?.email ||
            githubProfile.personalInfo.email ||
            "youremail@gmail.com",
          jobTitle: data.personalInfo?.jobTitle || "software engineer",
          phone: data.personalInfo?.phone || "8989898989",
          linkedin: data.personalInfo?.linkedin || "https://linkedin.in",
          github:
            data.personalInfo?.github || githubProfile.personalInfo.github,
          website:
            data.personalInfo?.website ||
            githubProfile.personalInfo.website ||
            "",
          address:
            data.personalInfo?.address ||
            githubProfile.personalInfo.address ||
            "",
          summary:
            data.personalInfo?.summary || "your proffesional summary here.  ",
        },
        experiences: data.experiences.map((exp: any) => ({
          ...exp,
          startDate: exp.startDate
            ? new Date(exp.startDate).toISOString().slice(0, 7)
            : "",
          endDate: exp.endDate
            ? new Date(exp.endDate).toISOString().slice(0, 7)
            : "",
        })),
        projects: data.projects.map((exp: any) => ({
          ...exp,
          startDate: exp.startDate
            ? new Date(exp.startDate).toISOString().slice(0, 7)
            : "",
          endDate: exp.endDate
            ? new Date(exp.endDate).toISOString().slice(0, 7)
            : "",
        })),
        education: data.education.map((edu: any) => ({
          ...edu,
          description: edu.description || "",
          startDate: edu.startDate
            ? new Date(edu.startDate).toISOString().slice(0, 7)
            : "",
          endDate: edu.endDate
            ? new Date(edu.endDate).toISOString().slice(0, 7)
            : "",
        })),
        skills: data.skills,
        customSections: data.customSections,
        sectionOrder:
          data.sectionOrder && data.sectionOrder.length > 0
            ? data.sectionOrder
            : [
                { title: "Personal Information", type: "core", isActive: true },
                { title: "Experience", type: "core", isActive: true },
                { title: "Projects", type: "core", isActive: true },
                { title: "Education", type: "core", isActive: true },
                { title: "Skills", type: "core", isActive: true },
                { title: "Custom Sections", type: "custom", isActive: true },
              ],
        template: selectedTemplate,
      };
    }
  });

  const sectionOrder: SectionType[] = [
    "personal",
    "experience",
    "project",
    "education",
    "skills",
    "custom",
    "reorder",
    "template",
  ];
  useEffect(() => {
    if (isError) {
      toast.error(error.message);
      return;
    }
  }, [isError, error]);

  const handleSectionComplete = (section: SectionType, data: any) => {
    setResumeData((prev) => {
      // Start with the previous state
      const updated = { ...prev };

      // Update the correct section based on the 'section' type
      if (section === "personal") {
        updated.personalInfo = data;
      } else if (section === "experience") {
        updated.experiences = data;
      } else if (section === "project") {
        updated.projects = data;
      } else if (section === "education") {
        updated.education = data;
      } else if (section === "skills") {
        updated.skills = data;
      } else if (section === "template") {
        updated.template = data;
      } else if (section === "custom") {
        updated.customSections = data;
      }
      sessionStorage.setItem(`resumeData-${id}`, JSON.stringify(updated));
      return updated;
    });
    toast("click save button to save everything successfully.");
  };
  const handleCustomSectionsUpdate = (sections: CustomSections[]) => {
    setTimeout(() => {
      setResumeData((prev) => ({
        ...prev,
        customSections: sections,
      }));
    }, 800);
  };
  const handleSectionReorder = (sections: ResumeSection[]) => {
    setResumeData((prev) => ({
      ...prev,
      sectionOrder: sections,
    }));
  };
  const handleSectionToggle = (title: string, isActive: boolean) => {
    setResumeData((prev) => ({
      ...prev,
      sectionOrder: prev.sectionOrder.map((section) =>
        section.title === title ? { ...section, isActive } : section
      ),
    }));
  };
  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template);
    setResumeData((prev) => ({
      ...prev,
      template,
    }));
    const currentUrl = window.location.pathname;
    window.history.replaceState({}, "", currentUrl);
  };
  const handleTemplateSave = () => {
    handleSectionComplete("template", selectedTemplate);
  };
  const handleSaveResume = () => {
    mutate(
      { resume: resumeData, resumeId: id },
      {
        onSuccess: () => {
          toast.success("resume saved succesdfully");
        },
        onError: () => {
          toast.error(error?.message);
        },
      }
    );
  };
  const goToPreviousSection = () => {
    const currentIndex = sectionOrder.indexOf(activeSection);
    if (currentIndex > 0) {
      setActiveSection(sectionOrder[currentIndex - 1]);
    }
  };
  const goToNextSection = () => {
    const currentIndex = sectionOrder.indexOf(activeSection);
    if (currentIndex < sectionOrder.length - 1) {
      setActiveSection(sectionOrder[currentIndex + 1]);
    }
  };

  const isSectionCompleted = (section: SectionType): boolean => {
    switch (section) {
      case "personal":
        return !!resumeData.personalInfo;
      case "experience":
        return (resumeData.experiences?.length || 0) > 0;
      case "project":
        return (resumeData.projects?.length || 0) > 0;
      case "education":
        return (resumeData.education?.length || 0) > 0;
      case "skills":
        return (resumeData.skills?.length || 0) > 0;
      case "custom":
        return (resumeData.customSections?.length || 0) > 0;
      case "reorder":
        return true; // Reordering is always considered complete
      case "template":
        return !!resumeData.template; // check if template exists
      default:
        return false;
    }
  };

  const templateData = templates.find(
    (template) => template.id == selectedTemplate
  );

  return (
    <>
      {isDownloading && (
        <MultiStepLoader
          loadingStates={loadingStates}
          loading={isDownloading}
        />
      )}
      <div className="flex flex-col relative">
        <div className="flex md:hidden  justify-end mb-5">
          {isPreviewOpen ? (
            <Button onClick={() => setIsPreviewOpen(false)}>
              Back to Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="hover-lift">
                <ShareModal
                  resumeId={id}
                  resumeName={title}
                  setIsDownloading={setIsDownloading}
                />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="hover-lift"
                onClick={() => setIsPreviewOpen(true)}
              >
                Preview{" "}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="hover-lift"
                onClick={handleSaveResume}
                disabled={isPending}
              >
                {isPending ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <div className="flex gap-2 justify-center items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Save
                  </div>
                )}
              </Button>
            </div>
          )}
        </div>
        {!isPreviewOpen && (
          <Card className="border-0 shadow-sm px-2 w-full">
            <div className="">
              <div className="lg:col-span-3">
                <div className="sticky top-20  p-2">
                  <div className="space-y-1 md:flex ">
                    {sectionOrder.map((section, index) => (
                      <button
                        key={section}
                        onClick={() => setActiveSection(section)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-left transition-colors ${
                          activeSection === section
                            ? "bg-secondary text-foreground"
                            : "text-muted-foreground hover:bg-secondary/50"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                            isSectionCompleted(section)
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary-foreground/20"
                          }`}
                        >
                          {section === "reorder" ? (
                            <Settings className="h-3 w-3" />
                          ) : isSectionCompleted(section) ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            index + 1
                          )}
                        </div>
                        <span>
                          {section === "personal"
                            ? "Personal Info"
                            : section === "experience"
                            ? "Experience"
                            : section === "project"
                            ? "Projects"
                            : section === "education"
                            ? "Education"
                            : section === "skills"
                            ? "Skills"
                            : section === "custom"
                            ? "Custom Sections"
                            : section === "reorder"
                            ? "Reorder Sections"
                            : "Template"}
                        </span>
                      </button>
                    ))}
                  </div>

                  <Separator className="my-4" />
                </div>
              </div>

              <div className="lg:col-span-9 w-full ">
                <div className="flex flex-col md:flex-row gap-6 justify-between ">
                  <div className="flex-1">
                    <div className="space-y-6">
                      {activeSection === "personal" ||
                      activeSection === "experience" ||
                      activeSection === "project" ||
                      activeSection === "education" ||
                      activeSection === "skills" ? (
                        <EditorSections
                          activeSection={activeSection}
                          resumeData={resumeData}
                          data={resumeData!}
                          onSectionComplete={handleSectionComplete}
                        />
                      ) : activeSection === "template" ? (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium">
                              Current Template
                            </h3>
                            <Dialog
                              open={isTemplateDialogOpen}
                              onOpenChange={setIsTemplateDialogOpen}
                            >
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <FileText className="mr-2 h-4 w-4" />
                                  Browse Templates
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-7xl p-0 h-[95%]">
                                <TemplateBrowser
                                  selectedTemplate={selectedTemplate}
                                  onSelectTemplate={handleTemplateSelect}
                                  onClose={() => setIsTemplateDialogOpen(false)}
                                  isDialog={true}
                                />
                              </DialogContent>
                            </Dialog>
                          </div>

                          <Card className="overflow-hidden border-0 shadow-sm">
                            <div className="relative h-40 overflow-hidden bg-white">
                              <img
                                src={
                                  templateData?.preview ||
                                  "/placeholder.svg?height=160&width=120"
                                }
                                alt={`${selectedTemplate} template`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-4">
                              <h3 className="font-medium capitalize">
                                {templateData?.name}
                              </h3>
                              <p className="text-sm text-slate-300">
                                {templateData?.description}
                              </p>
                            </div>
                          </Card>

                          <Button
                            onClick={handleTemplateSave}
                            className="w-full"
                          >
                            Continue with this Template
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      ) : activeSection === "custom" ? (
                        <CustomSectionBuilder
                          initialSections={resumeData.customSections}
                          onSave={handleCustomSectionsUpdate}
                          onSectionComplete={handleSectionComplete}
                          isLoading={isPending}
                        />
                      ) : activeSection === "reorder" ? (
                        <SectionReorder
                          sections={resumeData.sectionOrder}
                          onReorder={handleSectionReorder}
                          onToggleSection={handleSectionToggle}
                        />
                      ) : null}

                      <div className="flex justify-between pt-4">
                        <Button
                          variant="outline"
                          onClick={goToPreviousSection}
                          disabled={activeSection === sectionOrder[0]}
                          className="hover-lift"
                        >
                          <ChevronLeft className="mr-2 h-4 w-4" />
                        </Button>
                        <Button
                          onClick={goToNextSection}
                          className={`hover-lift ${
                            activeSection === "template" && "hidden"
                          } `}
                        >
                          {" "}
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-7 hidden md:flex">
                    <div className="sticky top-20">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-base font-medium">Preview</h3>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover-lift"
                          >
                            <ShareModal
                              resumeId={id}
                              resumeName={title}
                              setIsDownloading={setIsDownloading}
                            />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="hover-lift"
                            onClick={handleSaveResume}
                            disabled={isPending}
                          >
                            {isPending ? (
                              <LoaderCircle className="animate-spin" />
                            ) : (
                              <div className="flex gap-2 justify-center items-center">
                                <FileText className="mr-2 h-4 w-4" />
                                Save
                              </div>
                            )}
                          </Button>
                        </div>
                      </div>
                      <Card className="border-0 w-full overflow-auto shadow-sm  hidden md:flex">
                        <ResumePreview
                          template={resumeData.template || selectedTemplate}
                          resumeData={resumeData}
                          sectionOrder={resumeData.sectionOrder.filter(
                            (s) => s.isActive
                          )}
                        />
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}
        {isPreviewOpen && (
          <div className="lg:col-span-7 md:hidden">
            <div className="sticky top-20">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-medium">Preview</h3>
              </div>
              <Card className="border-0 w-full overflow-auto shadow-sm ">
                <ResumePreview
                  template={selectedTemplate}
                  resumeData={resumeData}
                  sectionOrder={resumeData.sectionOrder.filter(
                    (s) => s.isActive
                  )}
                />
              </Card>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
