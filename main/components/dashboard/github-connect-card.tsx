"use client";

import Link from "next/link";
import { useState } from "react";
import { Github, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useGetGithubUsername } from "@/query/user/query";

export function GithubConnectionCard() {
  const { data, isError, isLoading } = useGetGithubUsername();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const connected = Boolean(data?.githubUsername);
  async function handleRefresh() {
    try {
      setIsRefreshing(true);
      const res = await fetch(`/api/github-resume/${data?.githubUsername}`);
      if (res.ok) {
        toast.success("GitHub connection refreshed 🎉");
      } else {
        toast.error("Refresh failed ⚠️");
      }
    } catch {
      toast.error("Refresh failed ⚠️");
    } finally {
      setIsRefreshing(false);
    }
  }

  return (
    <Card
      className="
        relative overflow-hidden border border-border/60 bg-card
        transition-shadow duration-300 ease-out hover:shadow-lg
        focus-within:ring-1 focus-within:ring-emerald-500/60 flex justify-center flex-col"
    >      {isLoading && (
        <CardHeader>
          <CardTitle className="text-base md:text-lg font-semibold text-white">
            Checking GitHub connection...
          </CardTitle>
        </CardHeader>
      )}
      {isError && (
        <CardHeader>
          <CardTitle className="text-base md:text-lg font-semibold text-red-400">
            Failed to load GitHub connection
          </CardTitle>
          <CardDescription className="text-sm text-gray-300">
            Please try again later
          </CardDescription>
        </CardHeader>
      )}
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Github
              className={`h-6 w-6 ${
                connected ? "text-main animate-bounce" : "text-gray-400"
              }`}
            />
            <span
              aria-label={connected ? "connected" : "not connected"}
              className={`absolute -right-1 -top-1 h-3 w-3 rounded-full ${
                connected ? "bg-main animate-ping" : "bg-gray-300"
              }`}
            />
          </div>
          <div>
            <CardTitle className="text-base md:text-lg font-semibold text-white">
              {connected ? "GitHub Connected" : "GitHub Not Connected"}
            </CardTitle>
            <CardDescription className="text-sm text-gray-200 mt-1">
              {connected
                ? "Your GitHub data is synced"
                : "Connect GitHub to prefill your resume"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/integration/github"
            className="text-sm font-medium text-main hover:text-main transition-colors duration-300 underline-offset-4 hover:underline"
          >
            {connected ? "Manage connection" : "Connect now"}
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="gap-2 bg-transparent"
            aria-label="Refresh GitHub connection"
          >
            <RefreshCw
              className={`h-5 w-5 transition-transform duration-500 ${
                isRefreshing
                  ? "animate-spin text-teal-400"
                  : "text-gray-200 hover:text-teal-400"
              }`}
            />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
