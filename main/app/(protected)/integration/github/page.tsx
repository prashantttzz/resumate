"use client";

import type React from "react";
import { useMemo, useRef, useState, useEffect } from "react";
import { Github, CheckCircle2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetGithubUsername } from "@/query/user/query";

export default function GithubConnectPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [shake, setShake] = useState(false);
  const [connectedUsername, setConnectedUsername] = useState<string | null>(
    null
  );

  const rippleRef = useRef<HTMLSpanElement>(null);
  const canSubmit = useMemo(() => username.trim().length > 0, [username]);
  const { data } = useGetGithubUsername();

  useEffect(() => {
    if (data?.githubUsername) {
      setConnectedUsername(data.githubUsername);
      setUsername(data.githubUsername);
    }
  }, [data]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || isConnecting) return;

    setIsConnecting(true);
    setErrorOpen(false);

    try {
      const res = await fetch(`/api/github-resume/${username}`);
      if (!res.ok) throw new Error("Failed");

      const json = await res.json();
      if (json.success) {
        setConnectedUsername(username);
        setSuccessOpen(true);
        const timer = setTimeout(() => {
          setSuccessOpen(false);
          router.push("/dashboard");
        }, 1800);
        return () => clearTimeout(timer);
      } else {
        throw new Error("GitHub connection failed");
      }
    } catch (err) {
      console.error(err);
      setErrorOpen(true);
      setShake(true);
      setTimeout(() => setShake(false), 400);
    } finally {
      setIsConnecting(false);
    }
  }

  function triggerRipple(e: React.MouseEvent) {
    const el = rippleRef.current;
    if (!el) return;
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    el.style.width = el.style.height = `${size}px`;
    el.style.left = `${e.clientX - rect.left - size / 2}px`;
    el.style.top = `${e.clientY - rect.top - size / 2}px`;
    el.classList.remove("gc-ripple-anim");
    void el.offsetWidth;
    el.classList.add("gc-ripple-anim");
  }

  return (
    <main className=" mt-10 md:mt-32 grid place-items-center px-4 text-gray-100">
      <section className="relative w-full max-w-md rounded-2xl bg-card shadow-lg p-8 transition-all hover:shadow-2xl">
        <div className="flex justify-center mb-6">
          <Github
            className={`h-14 w-14 text-main transition-transform ${
              isConnecting ? "animate-breathe" : ""
            }`}
          />
        </div>

        <header className="text-center mb-6">
          <h1 className="text-2xl font-semibold">
            {connectedUsername
              ? "Manage GitHub Connection"
              : "Connect Your GitHub"}
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            {connectedUsername ? (
              <>
                Currently connected as{" "}
                <span className="text-main font-semibold">
                  @{connectedUsername}
                </span>
                . You can update it below.
              </>
            ) : (
              "Enter your username to sync repositories and personal info."
            )}
          </p>
        </header>

        <form onSubmit={onSubmit} className="space-y-5 relative">
          <Label htmlFor="gh-username" className="text-gray-300 font-medium">
            GitHub Username
          </Label>
          <div
            className={`relative rounded-lg border border-gray-600 bg-gray-700 focus-within:ring-2 focus-within:ring-main focus-within:border-main transition-all ${
              shake ? "animate-shake" : ""
            }`}
          >
            <Input
              id="gh-username"
              placeholder="octocat"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border-0  text-white  focus-visible:ring-0 text-base"
            />
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
              <Github
                className={`h-5 w-5 transition-colors ${
                  username ? "text-main" : "text-white-500"
                }`}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={!canSubmit || isConnecting}
            onClick={triggerRipple}
            className="relative overflow-hidden w-full bg-main text-white font-medium py-3 rounded-lg shadow-md hover:bg-main transition-all"
          >
            <span ref={rippleRef} />
            {isConnecting
              ? "Connecting..."
              : connectedUsername
              ? "Update GitHub"
              : "Connect GitHub"}
          </Button>
        </form>
      </section>

      {/* Success popup */}
      {successOpen && (
        <div className="fixed top-4 left-1/2 z-50 translate-x-1/2 bg-main text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-pop">
          <CheckCircle2 className="h-5 w-5" />
          <span>
            {connectedUsername ? "✅ GitHub Updated!" : "🎉 GitHub Connected!"}
          </span>
        </div>
      )}

      {/* Error popup */}
      {errorOpen && (
        <div className="fixed top-4 z-50 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-pop">
          <AlertTriangle className="h-5 w-5" />
          <span>Couldn’t connect, try again</span>
        </div>
      )}

      <style jsx>{`
        .animate-breathe {
          animation: breathe 2s ease-in-out infinite;
        }
        @keyframes breathe {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.08);
          }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          20%,
          60% {
            transform: translateX(-4px);
          }
          40%,
          80% {
            transform: translateX(4px);
          }
        }
        .animate-pop {
          animation: pop 0.3s ease-out forwards;
        }
        @keyframes pop {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </main>
  );
}
