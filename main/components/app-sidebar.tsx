"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart,
  FileText,
  Github,
  Home,
  Layers,
  Linkedin,
  LogOut,
  Newspaper,
  Star,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { signOut, useSession } from "next-auth/react";
import { Separator } from "./ui/separator";

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { data, status } = useSession();
  if (status === "loading") {
    return;
  }
  if (status === "unauthenticated") {
    router.push("/");
  }
  const user = data?.user;

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="flex items-center justify-between">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="">
              <Link href="/dashboard">
                <FileText className="h-10 w-10" />
                <span className="text-xl font-semibold">ResuMate</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/dashboard")}
                  tooltip="Dashboard"
                >
                  <Link href="/dashboard">
                    <Home className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/resume")}
                  tooltip="Resume"
                >
                  <Link href="/resume">
                    <FileText className="h-4 w-4" />
                    <span>Resume</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/cover-letter")}
                  tooltip="cover Letter"
                >
                  <Link href="/coverLetter">
                    <Newspaper className="h-4 w-4" />
                    <span>Cover Letter</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/templates")}
                  tooltip="Templates"
                >
                  <Link href="/templates">
                    <Layers className="h-4 w-4" />
                    <span>Templates</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/pro")}
                  tooltip="Premium"
                >
                  <Link href="/pro">
                    <Star className="h-4 w-4" />
                    <span>Pro</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Integrations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/integration/linkedin")}
                  tooltip="LinkedIn"
                >
                  <Link href="/integration/linkedin">
                    <Linkedin className="h-4 w-4" />
                    <span>LinkedIn</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isActive("/integration/github")}
                  tooltip="GitHub"
                >
                  <Link href="/integration/github">
                    <Github className="h-4 w-4" />
                    <span>GitHub</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <Separator />
              <SidebarMenuItem>
                <SidebarMenuButton className="mt-5" onClick={() => signOut()} tooltip="logout">
                  <LogOut />
                  Logout
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="flex mb-5 mt-5 items-center justify-start px-0 ">
              <Avatar className="h-6 w-6   ring-2 ring-background">
                <AvatarImage
                  src={user?.image || "/placeholder.svg?height=32&width=32"}
                  alt="User"
                />
              </Avatar>{" "}
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {user?.name || "guest"}
                </span>
                <span className="text-xs  text-muted-foreground">
                  {user?.email}
                </span>
              </div>{" "}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
