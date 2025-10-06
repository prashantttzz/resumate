"use client";
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Plus, LoaderCircle } from "lucide-react";
import { Input } from "./ui/input";
import {
  useCoverLetterCount,
  useCreateNewCoverLetter,
  useCreateNewResume,
  useResumeCount,
} from "@/query/resume/query";
import { isPremium } from "@/query/user/query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import PremiumButton from "./SubscriptionButton";

type Props = {
  type: "resume" | "cover letter";
};
const NewResume = ({ type }: Props) => {
  const { mutate: resumeMutate, isPending: resumePending } =
    useCreateNewResume();
  const { mutate: clMutate, isPending: clpending } = useCreateNewCoverLetter();
  const { data: resumeCount = 0 } = useResumeCount();
  const { data: coverLetterCount = 0 } = useCoverLetterCount();
  const { data: ispremium } = isPremium();
  const [title, setTitle] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useRouter();

  const maxFreeResumes = 3;

  const handleResumeCreate = () => {
    if (!title.trim()) {
      toast.error("Resume title can't be empty");
      return;
    }
    if (!ispremium?.isPremium && resumeCount! >= maxFreeResumes) {
      toast.error(
        "Free users can create up to 3 resumes only. Upgrade to premium for unlimited!"
      );
      return;
    }

    const toastId = toast.loading("Creating resume...");
    resumeMutate(title, {
      onSuccess: (resumeId: string) => {
        toast.success("Resume created!", { id: toastId });
        setOpen(false);
        navigate.push(`/resume/${resumeId}`);
      },
      onError: (error: any) => {
        toast.error(error?.message || "Something went wrong", { id: toastId });
      },
    });
  };
  const handleCoverLetterCreate = () => {
    if (!title.trim()) {
      toast.error("coverLetter title can't be empty");
      return;
    }
    if (!ispremium?.isPremium && coverLetterCount! >= maxFreeResumes) {
      toast.error(
        "Free users can create up to 3 cover Letter only. Upgrade to premium for unlimited!"
      );
      return;
    }

    const toastId = toast.loading("Creating cover letter...");
    clMutate(title, {
      onSuccess: (coverLetterId: string) => {
        toast.success("coverLetter created!", { id: toastId });
        setOpen(false);
        navigate.push(`/coverLetter/${coverLetterId}`);
      },
      onError: (error: any) => {
        toast.error(error?.message || "Something went wrong", { id: toastId });
      },
    });
  };

  return (
    <>
      {type === "resume" && (
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger className="flex p-2 h-8 w-8 bg-white items-center justify-center rounded-sm">
                            <Plus className="text-black" />
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {!ispremium?.isPremium && resumeCount! >= maxFreeResumes
                  ? "Resume Limit Reached"
                  : "Create New Resume"}
              </AlertDialogTitle>

              {!ispremium?.isPremium && resumeCount! >= maxFreeResumes ? (
                <div className="text-center p-4">
                  <p>
                    You have reached your free resume limit of {maxFreeResumes}.
                  </p>
                  <p className="mt-2 font-semibold">
                    Upgrade to premium for unlimited resumes.
                  </p>
                  <div
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    <PremiumButton />{" "}
                  </div>
                </div>
              ) : (
                <Input
                  placeholder="Enter name of resume"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={resumePending}
                />
              )}
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel disabled={resumePending}>
                Cancel
              </AlertDialogCancel>

              {!ispremium?.isPremium &&
              resumeCount! >= maxFreeResumes ? null : (
                <AlertDialogAction
                  onClick={handleResumeCreate}
                  disabled={resumePending}
                >
                  {resumePending ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    "Continue"
                  )}
                </AlertDialogAction>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      {type == "cover letter" && (
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger className="flex p-2 h-8 w-8 bg-white items-center justify-center rounded-sm">
                            <Plus className="text-black" />
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {!ispremium?.isPremium && resumeCount! >= maxFreeResumes
                  ? "cover Letter Limit Reached"
                  : "Create New Cover Letter"}
              </AlertDialogTitle>

              {!ispremium?.isPremium && resumeCount! >= maxFreeResumes ? (
                <div className="text-center p-4">
                  <p>
                    You have reached your free cover letter limit of{" "}
                    {maxFreeResumes}.
                  </p>
                  <p className="mt-2 font-semibold">
                    Upgrade to premium for unlimited cover letter.
                  </p>
                  <div
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    <PremiumButton />{" "}
                  </div>
                </div>
              ) : (
                <Input
                  placeholder="Enter name of resume"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={clpending}
                />
              )}
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel disabled={clpending}>Cancel</AlertDialogCancel>

              {!ispremium?.isPremium &&
              resumeCount! >= maxFreeResumes ? null : (
                <AlertDialogAction
                  onClick={handleCoverLetterCreate}
                  disabled={clpending}
                >
                  {clpending ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    "Continue"
                  )}
                </AlertDialogAction>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

export default NewResume;
