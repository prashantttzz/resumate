"use client";

import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Eye,
  MoreHorizontal,
  Trash2,
  FileText,
  LoaderCircle,
  Plus,
  Newspaper,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { cn, downloadCoverLetter, formatDate } from "@/lib/utils";
import { CoverLetter } from "@prisma/client";
import NewResume from "../NewResume";
import { toast } from "sonner";

export type coverProp = {
  coverLetters: CoverLetter[];
};
export function CoverLetterList({ coverLetters }: coverProp) {
  const [isDownloading, setIsDownloading] = useState(false);
  const ref = useRef(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const handledownload = async ({
    e,
    id,
    title,
  }: {
    e: React.MouseEvent;
    id: string;
    title: string;
  }) => {
    e.preventDefault();
    toast.success("downloading");
    await downloadCoverLetter({
      contentRef: ref,
      title: title,
      onStart: () => setIsDownloading(true),
      onSuccess: () => setIsDownloading(false),
      onError: () => {
        setIsDownloading(false);
        toast.error("Download failed. Try again.");
      },
    });
  };
  return (
    <Card className="border-0 shadow-sm flex-1">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">
          Your Cover Letters
        </CardTitle>
        <div className="flex items-center gap-2">
          <NewResume type="cover letter" />
          <div className="flex border rounded-md overflow-hidden">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-none",
                viewMode === "grid" && "bg-secondary text-secondary-foreground"
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
                viewMode === "list" && "bg-secondary text-secondary-foreground"
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
        {coverLetters.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Newspaper className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No cover letters yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first cover letter to get started
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {coverLetters.map((coverLetter) => (
              <Link
                href={`/coverLetter/${coverLetter.id}`}
                key={coverLetter.id}
                className="block group"
              >
                <div className="border-0 bg-secondary/30 rounded-lg p-4 hover:bg-secondary/50 transition-all h-full">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-start gap-2">
                      <div className="w-10 h-10 rounded-md bg-background flex items-center justify-center">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-sm">
                            {coverLetter.title}
                          </h3>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 flex flex-col ">
                          Last updated:
                          <div></div>
                          {formatDate(coverLetter.updatedAt.toISOString())}
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
                          onClick={(e) =>
                            handledownload({
                              e,
                              id: coverLetter.id,
                              title: coverLetter.title,
                            })
                          }
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
                        <DropdownMenuSeparator />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </Link>
            ))}
            <div className=" flex justify-center items-center"></div>{" "}
          </div>
        ) : (
          <div className="space-y-2">
            {coverLetters.map((coverLetter) => (
              <Link
                href={`/coverLetter/${coverLetter.id}`}
                key={coverLetter.id}
                className="block group"
              >
                <div className="flex items-center justify-between p-3 rounded-md bg-secondary/30 hover:bg-secondary/50 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-background flex items-center justify-center">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-sm">
                          {coverLetter.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>
                          Last updated:{" "}
                          {formatDate(coverLetter.updatedAt.toDateString())}
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
                          onClick={(e) =>
                            handledownload({
                              e,
                              id: coverLetter.id,
                              title: coverLetter.title,
                            })
                          }
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
  );
}
