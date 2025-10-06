// components/resume/ResumeSelectionScreen.tsx
"use client";

import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { useGetAllResumes } from "@/query/resume/query";
import { PlusCircle } from "lucide-react";
import Link from "next/link"; // Assuming you have Next.js Link for creating new resumes

interface ResumeSelectionScreenProps {
  onSelectResume: (id: string) => void;
}

export function ResumeSelectionScreen({ onSelectResume }: ResumeSelectionScreenProps) {
  const {
    data: resumes,
    isPending,
    isError,
    error,
  } = useGetAllResumes(); // Fetch all available resumes

  if (isPending) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-white">
        <Loader />
        <p className="mt-4">Loading available resumes...</p>
      </div>
    );
  }

  if (isError) {
    console.error("Error fetching resumes:", error);
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-red-400">
        <p>Failed to load resumes. Please try again later.</p>
        <p className="text-sm text-red-300">{error?.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-white">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-100 mb-4">Welcome to Your AI Resume Builder!</h1>
        <p className="text-lg text-gray-300">
          To get started, please select one of your existing resumes or create a new one.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
        {/* Option to create a new resume */}
        <Link href="/create-new-resume" passHref> {/* Adjust this path as per your application's routing */}
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center p-6 bg-card border-dashed border-2 border-gray-600 hover:bg-gray-700 transition-colors h-40 w-full"
          >
            <PlusCircle className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-gray-300 text-lg">Create New Resume</span>
          </Button>
        </Link>

        {resumes?.length > 0 ? (
          resumes.map((resume) => (
            <Button
              key={resume.id}
              variant="outline"
              onClick={() => onSelectResume(resume.id)}
              className="flex flex-col items-start p-6 bg-card border border-gray-700 hover:bg-gray-700 transition-colors h-40 w-full text-left"
            >
              <h3 className="text-lg font-semibold text-gray-100 mb-2">{resume.title || 'Untitled Resume'}</h3>
              <p className="text-xs text-gray-500 mt-auto">ID: {resume.id.substring(0, 8)}...</p>
            </Button>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-400">
            <p>You don't have any existing resumes. Please create one to begin!</p>
          </div>
        )}
      </div>
    </div>
  );
}