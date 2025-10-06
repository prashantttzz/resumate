"use client";

import Loader from "@/components/Loader";
import { ResumeEditor } from "@/components/resume/resume-editor";
import { useGetResumebyId, useUpdateTitle } from "@/query/resume/query";
import { useGetGithubProfile } from "@/query/user/query";
import { Edit3Icon, LoaderCircle, CheckIcon, XIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function ResumePage() {
  const params = useParams();
  const id = params.id as string;

  const { data: resumeData, isPending: isResumeLoading } = useGetResumebyId(id);
  const { data: githubData, isLoading: isGithubLoading } = useGetGithubProfile();

  const [editing, setEditing] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const { mutate: updateTitle, isPending: isUpdating } = useUpdateTitle();

  if (isResumeLoading || isGithubLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }
console.log("resume",resumeData)
  // Safe merge logic
  const mergedData = resumeData
    ? {
        ...resumeData,
        personalInfo:
          resumeData.personalInfo ??
          githubData?.data?.personalInfo ??
          {
            fullName: "John Doe",
            email: "johndoe@gmail.com",
            jobTitle: "Software Engineer",
            phone: "8989898989",
            linkedin: "https://linkedin.in",
            github: "",
            website: "",
            address: "",
            summary: "Your professional summary here.",
          },
        projects:
          resumeData.projects?.length > 0
            ? resumeData.projects
            : githubData?.data?.projects ?? [],
        skills:
          resumeData.skills?.length > 0
            ? resumeData.skills
            : githubData?.data?.skills ?? [],
        experiences: resumeData.experiences ?? [],
        education: resumeData.education ?? [],
        sectionOrder:
          resumeData.sectionOrder?.length > 0
            ? resumeData.sectionOrder
            : [
                { title: "Personal Information", type: "core", isActive: true },
                { title: "Experience", type: "core", isActive: true },
                { title: "Projects", type: "core", isActive: true },
                { title: "Education", type: "core", isActive: true },
                { title: "Skills", type: "core", isActive: true },
                { title: "Custom Sections", type: "custom", isActive: true },
              ],
      }
    : null;


  return (
    <div className="flex flex-col gap-6 animate-in">
      <div>
        <h1 className="text-2xl font-medium">Resume Editor</h1>
        <div className="text-muted-foreground flex items-center gap-3">
          <span>Create and customize your professional</span>
          {editing ? (
            <div className="flex items-center gap-2">
              <input
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                className="border border-gray-600 bg-transparent px-2 py-1 rounded text-white"
                autoFocus
              />
              <button
                onClick={() => updateTitle({ title: titleInput, id })}
                className="text-green-400"
                disabled={isUpdating}
              >
                {isUpdating ? <Loader /> : <CheckIcon />}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="text-red-400"
              >
                <XIcon />
              </button>
            </div>
          ) : (
            <span className="text-white font-semibold flex items-center gap-2">
              {resumeData?.title}
              <Edit3Icon
                className="cursor-pointer"
                onClick={() => {
                  setEditing(true);
                  setTitleInput(resumeData?.title || "");
                }}
              />
            </span>
          )}
        </div>
      </div>

      {mergedData && (
        <ResumeEditor
          data={mergedData}
          id={id}
          title={mergedData.title || "Resume"}
          githubProfile={githubData?.data}
        />
      )}
    </div>
  );
}
