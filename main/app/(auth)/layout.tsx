import type React from "react";
import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "get started with ResuMate",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
