import type React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "@/components/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import SessionProvider from "@/providers/SessionProvider";
import ProtectedLayout from "@/providers/ProtectedRoute";
import { Providers } from "@/providers/queryProvider";
import { Toaster } from "@/components/ui/sonner";
import { EchoWidget } from "@/components/chatbot";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-screen" suppressHydrationWarning>
      <SidebarProvider>
        <SessionProvider>
          <Providers>
            <AppSidebar />
            <SidebarInset>
              <DashboardHeader />
              <ProtectedLayout>
                <main className="flex-1 p-4 md:p-6">{children}</main>
                <EchoWidget organizationId="org_310NQpCIdkfJxfD4f1OcQ0YLsXh"/>
                <Toaster/>
              </ProtectedLayout>
            </SidebarInset>
          </Providers>
        </SessionProvider>
      </SidebarProvider>
    </div>
  );
}
