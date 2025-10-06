"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Download,
  Eye,
  MoreHorizontal,
  FileText,
  LoaderCircle,
  Delete,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { cn, downloadPdf, formatDate } from "@/lib/utils";
import { resume } from "@/types/resume";
import NewResume from "../NewResume";
import { ShareModal } from "../share-modal";
import { toast } from "sonner";
import { loadingStates } from "@/constants";
import { MultiStepLoader } from "../ui/multi-step-loader";
import { useDeleteResume } from "@/query/resume/query";

export type resumeProps = {
  resumes: resume[];
};
export function ResumeList({ resumes }: resumeProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const { mutate, isPending:isDeleting } = useDeleteResume();
  const handledownload = async (e: React.MouseEvent, resume: resume) => {
    e.preventDefault();
    toast.success("downloading");
    await downloadPdf({
      resumeId: resume.id,
      title: resume.title,
      onStart: () => setIsDownloading(true),
      onSuccess: () => setIsDownloading(false),
      onError: () => {
        setIsDownloading(false);
        toast.error("Download failed. Try again.");
      },
    });
  };

  const handleDelete = (e:React.MouseEvent,id: string) => {
    e.preventDefault()
    mutate(id, {
      onSuccess: () => {
        toast.success("resume deleted successfully");
      },
    });
  };
  return (
    <>
      {isDownloading && (
        <MultiStepLoader
          loadingStates={loadingStates}
          loading={isDownloading}
        />
      )}
      <Card className="border-0 shadow-sm flex-1">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-2xl font-semibold mb-3">
            Your Resumes
          </CardTitle>
          <div className="flex items-center gap-2">
            <NewResume type="resume" />
            <div className="flex border rounded-md overflow-hidden">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-none",
                  viewMode === "grid" &&
                    "bg-secondary text-secondary-foreground"
                )}
                onClick={() => setViewMode("grid")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="7" height="7" x="3" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="14" rx="1" />
                  <rect width="7" height="7" x="3" y="14" rx="1" />
                </svg>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-none",
                  viewMode === "list" &&
                    "bg-secondary text-secondary-foreground"
                )}
                onClick={() => setViewMode("list")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" x2="21" y1="6" y2="6" />
                  <line x1="3" x2="21" y1="12" y2="12" />
                  <line x1="3" x2="21" y1="18" y2="18" />
                </svg>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {resumes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No resumes yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first resume to get started
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {resumes.map((resume) => (
                <Link
                  href={`/resume/${resume.id}`}
                  key={resume.id}
                  className="block group"
                >
                  <div className="bg-secondary border-1 rounded-lg p-4 hover:bg-secondary/50 transition-all h-full">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start gap-2">
                        <div className="w-10 h-10 rounded-md bg-background flex items-center justify-center">
                          <FileText className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-md">
                              {resume.title}
                            </h3>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Last updated:{" "}
                            {formatDate(resume.updatedAt.toDateString())}{" "}
                          </p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => e.preventDefault()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={(e) => e.preventDefault()}
                          >
                            <ShareModal
                              setIsDownloading={setIsDownloading}
                              resumeId={resume.id}
                              resumeName={resume.title}
                            />
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => handledownload(e, resume)}
                            className="cursor-pointer"
                          >
                            {isDownloading ? (
                              <LoaderCircle className="animate-spin" />
                            ) : (
                              <div className="flex gap-2">
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </div>
                            )}
                          </DropdownMenuItem>
                            <DropdownMenuItem
                            onClick={(e) => handleDelete(e,resume.id)}
                            className="cursor-pointer"
                          >
                            {isDeleting ? (
                              <LoaderCircle className="animate-spin" />
                            ) : (
                              <div className="flex gap-2">
                                <Delete className="mr-2 h-4 w-4" />
                                Delete
                              </div>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-4 mb-1">
                      <div className="flex items-center">
                        <Eye className="mr-1 h-3 w-3" />
                        <span>{resume.views} views</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {resumes.map((resume) => (
                <Link
                  href={`/resume/${resume.id}`}
                  key={resume.id}
                  className="block group"
                >
                  <div className="flex items-center justify-between p-3 rounded-md bg-secondary/30 hover:bg-secondary/50 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-background flex items-center justify-center">
                        <FileText className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-md">
                            {resume.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>
                            Last updated:{" "}
                            {formatDate(resume.updatedAt.toDateString())}
                          </span>
                          <span className="flex items-center">
                            <Eye className="mr-1 h-3 w-3" />
                            {resume.views} views
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => e.preventDefault()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={(e) => e.preventDefault()}
                          >
                            <ShareModal
                              resumeId={resume.id}
                              setIsDownloading={setIsDownloading}
                              resumeName={resume.title}
                            />
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => handledownload(e, resume)}
                            className="cursor-pointer"
                          >
                            {isDownloading ? (
                              <LoaderCircle className="animate-spin" />
                            ) : (
                              <div className="flex gap-2">
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </div>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => handleDelete(e,resume.id)}
                            className="cursor-pointer"
                          >
                            {isDeleting ? (
                              <LoaderCircle className="animate-spin" />
                            ) : (
                              <div className="flex gap-2">
                                <Delete className="mr-2 h-4 w-4" />
                                Delete
                              </div>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
