"use client";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowUpRight, FileText, MessageSquare } from "lucide-react";

export function AiAssistantCard({isPremium}:{isPremium:boolean}) {
  return (
    <Card
      className="
        relative overflow-hidden border border-border/60 bg-card
        transition-shadow duration-300 ease-out hover:shadow-lg
        focus-within:ring-1 focus-within:ring-main flex flex-col justify-center"
    >
      <CardContent className="p-5">
        <div className="flex items-center gap-4">
          {/* Icon badge */}
          <div
            className={cn(
              "relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
              "bg-main/10 ring-1 ring-inset ring-main/30",
              "transition-transform duration-300 ease-out group-hover:scale-[1.015]"
            )}
          >
            {/* Gentle glow/breathe that respects reduced motion */}
            <div className="pointer-events-none absolute inset-0 rounded-xl bg-main/0 motion-safe:animate-pulse" />

            {/* Composite icon: File + Chat */}
            <div className="relative">
              <FileText
                aria-hidden="true"
                className="h-6 w-6 text-main/90"
              />
              <MessageSquare
                aria-hidden="true"
                className="absolute -right-2 -bottom-2 h-4 w-4 text-main/80"
              />
            </div>
            <span className="sr-only">AI resume builder chat assistant</span>
          </div>

          {/* Text */}
          <div className="flex min-w-0 flex-col gap-1">
            <h3 className="text-pretty text-lg font-semibold leading-6 text-white">
              Coco is ready to help!
            </h3>
            <p className="text-pretty text-sm leading-6 text-muted-foreground">
              Ready to polish your resume with quick tips and suggestions.
            </p>

          </div>
        </div>
            <div className="pt-5 flex w-full justify-between">
              <Link
                href="/ai-builder"
                className={cn(
                  "text-sm font-medium text-main hover:text-main",
                  "transition-colors underline-offset-4 hover:underline"
                )}
              >
                Chat now
              </Link>
              <ArrowUpRight className="h-5 w-5 text-main"/>
            </div>
      </CardContent>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -top-8 size-20 rounded-full bg-main/5"
      />
    </Card>
  );
}

export default AiAssistantCard;
