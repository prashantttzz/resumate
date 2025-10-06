"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Download, Link, Share2 } from "lucide-react";
import { useGetResumebyId, useSetSlug } from "@/query/resume/query";
import { toast } from "sonner";
import { downloadPdf } from "@/lib/utils";


interface ShareModalProps {
  resumeId: string;
  resumeName: string;
  setIsDownloading: (isDownloading: boolean) => void;
}

export function ShareModal({ resumeId, resumeName ,setIsDownloading }: ShareModalProps) {
  const { mutate } = useSetSlug();
  const { data } = useGetResumebyId(resumeId);
  const [open, setOpen] = useState(false);
  const url = process.env.NEXT_PUBLIC_BASE_URL!;
  const [customUrlInput, setCustomUrlInput] = useState("");
  const [isCustomUrlAvailable, setIsCustomUrlAvailable] = useState(true);
  const [isCheckingUrl, setIsCheckingUrl] = useState(false);
  const [savedCustomUrl, setSavedCustomUrl] = useState("");
  const [shareLink, setShareLink] = useState(data?.slug || "");
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast("copied");
  };
  useEffect(() => {
    setShareLink(data?.slug!);
  }, [data]);

  const checkCustomUrlAvailability = async (input: string) => {
    if (!input.trim()) {
      setIsCustomUrlAvailable(true);
      return;
    }
    const link = `${url}preview/${input}`;
    setIsCheckingUrl(true);
    const response = await fetch("/api/slug-check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ link }),
    });

    const data = await response.json();
    console.log("data", data);
    setIsCustomUrlAvailable(data?.available);
    setIsCheckingUrl(false);
  };

  const handleCustomUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-");
    setCustomUrlInput(value);
    checkCustomUrlAvailability(value);
  };

  const saveCustomUrl = () => {
    if (!customUrlInput || !isCustomUrlAvailable) return;
    setSavedCustomUrl(customUrlInput);
    const link = `${url}preview/${customUrlInput}`;
    setShareLink(link);
    mutate(
      { url: link, id: resumeId },
      {
        onSuccess: () => {
          toast.success(`Your resume is now available at ${link}`);
        },
      }
    );
    setCustomUrlInput("");
  };

  const handleExport = async () => {
    await downloadPdf({
      resumeId,
      title: resumeName,
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
 <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="hover-lift flex gap-2 items-center  justify-center">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Share Resume</DialogTitle>
          <DialogDescription>
            Share your resume "{resumeName}" with others.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="link" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="link">Share Link</TabsTrigger>
            <TabsTrigger value="custom">Custom URL</TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="share-link">Share Link</Label>
              <div className="flex gap-2">
                <Input
                  id="share-link"
                  value={shareLink}
                  readOnly
                  className="flex-1"
                />
                <Button variant="outline" size="icon" onClick={handleCopyLink}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="custom-url">Custom URL</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Create a memorable, custom URL for your resume
              </p>

              {savedCustomUrl ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-3 border rounded-md bg-secondary/20">
                    <div className="flex-1">
                      <p className="text-sm font-medium">Your custom URL</p>
                      <p className="text-sm text-primary">{shareLink} </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyLink}
                    >
                      <Copy className="h-3.5 w-3.5 mr-1" />
                      Copy
                    </Button>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setSavedCustomUrl("")}
                  >
                    Change Custom URL
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-shrink-0 text-sm text-muted-foreground">
                      {url}preview/
                    </div>
                    <div className="relative flex-1">
                      <Input
                        id="custom-url"
                        value={customUrlInput}
                        onChange={handleCustomUrlChange}
                        placeholder="your-custom-url"
                        className={
                          !isCustomUrlAvailable ? "border-red-500 pr-8" : ""
                        }
                      />
                      {isCheckingUrl && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-primary animate-spin"></div>
                        </div>
                      )}
                      {!isCustomUrlAvailable &&
                        !isCheckingUrl &&
                        customUrlInput && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="h-4 w-4 text-red-500">❌</div>
                          </div>
                        )}
                      {isCustomUrlAvailable &&
                        !isCheckingUrl &&
                        customUrlInput && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <div className="h-4 w-4 text-green-500">✓</div>
                          </div>
                        )}
                    </div>
                  </div>

                  {!isCustomUrlAvailable && customUrlInput && (
                    <p className="text-xs text-red-500">
                      This URL is already taken. Please choose another one.
                    </p>
                  )}

                  <div className="space-y-2 text-xs text-muted-foreground">
                    <p>Guidelines for custom URLs:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Use lowercase letters, numbers, and hyphens only</li>
                      <li>Avoid using special characters or spaces</li>
                      <li>Choose something memorable and professional</li>
                      <li>Minimum 3 characters, maximum 30 characters</li>
                    </ul>
                  </div>

                  <Button
                    onClick={saveCustomUrl}
                    className="w-full"
                    disabled={
                      !customUrlInput || !isCustomUrlAvailable || isCheckingUrl
                    }
                  >
                    <Link className="mr-2 h-4 w-4" />
                    Save Custom URL
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="sm:w-auto w-full"
          >
            Close
          </Button>
          <Button
            variant="outline"
            className="sm:w-auto w-full"
            onClick={handleExport}
          >
                <Download className="mr-2 h-4 w-4" />
                Download PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
