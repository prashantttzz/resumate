import type React from "react";
import SessionProvider from "@/providers/SessionProvider";
import ProtectedLayout from "@/providers/ProtectedRoute";
import { Providers } from "@/providers/queryProvider";
import { Toaster } from "@/components/ui/sonner";
import { EchoWidget } from "@/components/chatbot";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "@/components/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-screen" suppressHydrationWarning>
      <SessionProvider>
        <Providers>
          <ProtectedLayout>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                <DashboardHeader />
                <main className="flex-1 p-5">{children}</main>
              </SidebarInset>
            </SidebarProvider>
            <EchoWidget organizationId="org_310NQpCIdkfJxfD4f1OcQ0YLsXh" />
            <Toaster />
          </ProtectedLayout>
        </Providers>
      </SessionProvider>
    </div>
  );
}
