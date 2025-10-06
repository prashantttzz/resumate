"use client";
import NewResume from "./NewResume";
import { SidebarTrigger } from "./ui/sidebar";
import { ModeToggle } from "./mode-toggle";
import { AnimatedGradientText } from "./magicui/animated-gradient-text";
import { cn } from "@/lib/utils";
import { isPremium } from "@/query/user/query";
import { Plus } from "lucide-react";
import Link from "next/link";
import ProStatusButton from "./pro-status-indicatior";

export function DashboardHeader() {
  const { data ,isLoading } = isPremium();

  const premium = data?.isPremium;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 md:px-6 justify-between">
      <SidebarTrigger />
      <div className="flex gap-2 items-center justify-center">
     <ProStatusButton isPro={premium} loading={isLoading}/>
        <ModeToggle />
      </div>
    </header>
  );
}
