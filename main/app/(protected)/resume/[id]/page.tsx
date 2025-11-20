"use client";

import Loader from "@/components/Loader";
import { ResumeEditor } from "@/components/resume/resume-editor";
import { mergeResumeData } from "@/lib/resume-merger";
import { useGetResumebyId, useUpdateTitle } from "@/query/resume/query";
import { useGetGithubProfile } from "@/query/user/query";
import { Edit3Icon, LoaderCircle, CheckIcon, XIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function ResumePage() {
  const params = useParams();
  const id = params.id as string;

  const { data: resumeData, isPending: isResumeLoading } = useGetResumebyId(id);
  const { data: githubData, isLoading: isGithubLoading } =
    useGetGithubProfile();

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

  const mergedData = mergeResumeData(resumeData, githubData?.data);

  if (!mergedData) {
    return (
      <div className="p-10 text-center text-red-400">
        Error: Could not load resume data.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in">
      <div className="flex gap-3">
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
                {isUpdating ? (
                  <LoaderCircle className="animate-spin w-4 h-4" />
                ) : (
                  <CheckIcon className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="text-red-400"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <span className="text-white font-semibold flex items-center gap-2">
              {mergedData.title}
              <Edit3Icon
                className="cursor-pointer w-4 h-4"
                onClick={() => {
                  setEditing(true);
                  setTitleInput(mergedData.title || "");
                }}
              />
            </span>
          )}
        </div>
      </div>
      <ResumeEditor
        data={mergedData}
        id={id}
        title={mergedData.title || "Resume"}
        githubProfile={githubData?.data}
      />
    </div>
  );
}
