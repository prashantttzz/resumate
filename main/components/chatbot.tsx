"use client";
import { useEffect } from "react";

export function EchoWidget({ organizationId}:{organizationId:string}) {
  useEffect(() => {
    if (document.getElementById("echo-widget-script")) return;
    const s = document.createElement("script");
    s.id = "echo-widget-script";
    s.src = "https://convodesk-widget.pages.dev/widget.js";
    s.async = true;
    s.setAttribute("data-organization-id", organizationId);
    document.body.appendChild(s);
    return () => s.remove();
  }, [organizationId]);
  return null
}
