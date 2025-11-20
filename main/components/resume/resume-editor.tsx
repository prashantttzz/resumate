"use client";

import React from "react";
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
  CheckIcon,
  XIcon,
  Edit3Icon,
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
import { useSaveResume, useUpdateTitle } from "@/query/resume/query";
import { CustomSections, ResumeData, SectionType } from "@/types/resume";
import { CustomSectionBuilder } from "./custom-section-builder";
import { ResumeNotFound } from "../error";
import { ShareModal } from "../share-modal";
import { loadingStates, templates } from "@/constants";
import { useSearchParams } from "next/navigation";
import { MultiStepLoader } from "../ui/multi-step-loader";
import { initializeResumeState } from "@/lib/resume-hydrater";

const CustomLoader = () => <LoaderCircle className="animate-spin w-4 h-4" />;

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

  const initialTemplateId = searchParams.get("template") || data.template;

  const [selectedTemplate, setSelectedTemplate] =
    useState<string>(initialTemplateId);

  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    return initializeResumeState(id, data, githubProfile, initialTemplateId);
  });

  if (!resumeData) {
    return <ResumeNotFound variant="error" />;
  }

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
      toast.error(error?.message);
    }
  }, [isError, error]);

  const handleSectionComplete = (
    section: SectionType,
    updatedSectionData: any
  ) => {
    setResumeData((prev) => {
      const updated = { ...prev };
      switch (section) {
        case "personal":
          updated.personalInfo = updatedSectionData;
          break;
        case "experience":
          updated.experiences = updatedSectionData;
          break;
        case "project":
          updated.projects = updatedSectionData;
          break;
        case "education":
          updated.education = updatedSectionData;
          break;
        case "skills":
          updated.skills = updatedSectionData;
          break;
        case "custom":
          updated.customSections = updatedSectionData;
          break;
        case "template":
          updated.template = updatedSectionData;
          break;
        default:
          break;
      }
      sessionStorage.setItem(`resumeData-${id}`, JSON.stringify(updated));
      return updated;
    });
    toast("Click save button to save everything successfully.");
  };

  const handleCustomSectionsUpdate = (sections: CustomSections[]) => {
    setResumeData((prev) => ({
      ...prev,
      customSections: sections,
    }));
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
          toast.success("Resume saved successfully");
          sessionStorage.removeItem(`resumeData-${id}`);
        },
        onError: (e) => {
          toast.error(e.message || "Failed to save resume.");
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
        return !!resumeData.personalInfo && !!resumeData.personalInfo.fullName;
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
        return true;
      case "template":
        return !!resumeData.template;
      default:
        return false;
    }
  };
  const handleSectionAutoSave = (section: SectionType, values: any) => {
    setResumeData((prev) => {
      const updated = { ...prev };

      if (section === "personal") updated.personalInfo = values;
      if (section === "experience") updated.experiences = values;
      if (section === "project") updated.projects = values;
      if (section === "education") updated.education = values;
      if (section === "skills") updated.skills = values;

      sessionStorage.setItem(`resumeData-${id}`, JSON.stringify(updated));
      return updated;
    });

    // your cute toast
    toast.success("Saved");
  };

  const templateData = templates.find(
    (template) => template.id === selectedTemplate
  );

  return (
    <>
      {isDownloading && (
        <MultiStepLoader
          loadingStates={loadingStates}
          loading={isDownloading}
        />
      )}
      <div className="relative">
        <div className="flex md:hidden justify-end mb-5">
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
                  <CustomLoader />
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
          <Card className="border-0  bg-transparent w-full">
            <div className="sticky flex justify-between items-center">
              <div className="flex flex-col w-full md:flex-row flex-wrap md:space-y-0 md:space-x-1 items-center overflow-x-auto pb-2">
                {sectionOrder.map((section, index) => (
                  <React.Fragment key={section}>
                    <button
                      onClick={() => setActiveSection(section)}
                      className={`w-full md:w-auto flex items-center gap-2 px-3 py-2 text-sm rounded-md text-left transition-colors flex-shrink-0 ${
                        activeSection === section
                          ? "bg-secondary text-foreground"
                          : "text-muted-foreground hover:bg-secondary/50"
                      }`}
                    >
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

                    {index < sectionOrder.length - 1 && (
                      <ChevronRight className="hidden md:block h-4 w-4 text-gray-500 flex-shrink-0 mx-1" />
                    )}
                  </React.Fragment>
                ))}
              </div>
              <div className=" hidden md:flex gap-2">
                <Button variant="outline" size="sm" className="hover-lift">
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
                    <CustomLoader />
                  ) : (
                    <div className="flex gap-2 justify-center items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      Save
                    </div>
                  )}
                </Button>
              </div>
            </div>
            <Separator className="my-2 " />

            <div className="flex  justify-between gap-10">
              <div className="flex flex-col flex-1 ">
                <div className="w-full ">
                  <div className="flex flex-col md:flex-row gap-6 justify-between ">
                    <div className="flex-1">
                      <div className="space-y-6 glass !border-2 border-white/70 drop-shadow-lg p-5 rounded-xl bg-card">
                        {activeSection === "personal" ||
                        activeSection === "experience" ||
                        activeSection === "project" ||
                        activeSection === "education" ||
                        activeSection === "skills" ? (
                          <EditorSections
                            activeSection={activeSection}
                            resumeData={resumeData}
                            data={resumeData}
                            onSectionComplete={handleSectionComplete}
                            onSectionChange={handleSectionAutoSave}
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
                                    onClose={() =>
                                      setIsTemplateDialogOpen(false)
                                    }
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
                                    `https://placehold.co/300x400/333333/FFFFFF?text=${selectedTemplate}`
                                  }
                                  onError={(e) => {
                                    (
                                      e.target as HTMLImageElement
                                    ).src = `https://placehold.co/300x400/333333/FFFFFF?text=${
                                      templateData?.name || "Template"
                                    }`;
                                  }}
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
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className=" hidden md:flex ">
                <div className="sticky top-20">
                  <div className="flex w-full items-end justify-end  mb-2"></div>
                  <ResumePreview
                    template={resumeData.template || selectedTemplate}
                    resumeData={resumeData}
                    sectionOrder={resumeData.sectionOrder.filter(
                      (s) => s.isActive
                    )}
                  />
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
