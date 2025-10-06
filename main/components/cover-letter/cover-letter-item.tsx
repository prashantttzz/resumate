"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileText, MoreHorizontal, Edit, Download, Clock } from "lucide-react";
import { downloadCoverLetter, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";
import Loader from "../Loader";
import { CoverLetter } from "@/types/resume";

interface Props {
  coverLetter: CoverLetter;
}

export function CoverLetterItem({ coverLetter }: Props) {
  const getTimeElapsed = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      if (diffInHours === 0) {
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
      }
      return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
    } else if (diffInDays < 30) {
      const diffInWeeks = Math.floor(diffInDays / 7);
      return `${diffInWeeks} week${diffInWeeks !== 1 ? "s" : ""} ago`;
    } else {
      return formatDate(dateString);
    }
  };
  const [isDownloading, setIsDownloading] = useState(false);
  const handleExport = async () => {
    await downloadCoverLetter({
      coverLetterId: coverLetter.id,
      title: coverLetter.title,
      onStart: () => setIsDownloading(true),
      onSuccess: () => setIsDownloading(false),
      onError: () => {
        setIsDownloading(false);
        toast.error("Download failed. Try again.");
      },
    });
  };
  return (
    <>
      <div className="border rounded-lg p-4 hover:bg-secondary/20 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center shrink-0">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-medium truncate">{coverLetter.title}</h3>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>
                    Updated{" "}
                    {getTimeElapsed(coverLetter.updatedAt.toISOString())}
                  </span>
                </div>
                <span>•</span>
                <span>{coverLetter.template} template</span>
              </div>
            </div>
          </div>

          <div className="flex">
            <Link href={`/coverLetter/${coverLetter.id}`} passHref>
              <Button variant="outline" size="sm" className="h-9">
                <Edit className="h-4 w-4 mr-2" />
                <span>Edit</span>
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Button variant="ghost" onClick={handleExport}>
                    <Download />
                    {isDownloading ? <Loader /> : "dowload"}
                  </Button>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      {/* <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your coverLetter "{coverLetter.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}
    </>
  );
}
