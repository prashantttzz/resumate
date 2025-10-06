"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Search, ArrowUpDown, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ResumeItem } from "./resume-list";
import { useGetAllResumes } from "@/query/resume/query";
import { LoadingScreen } from "../loading-screen";
import NewResume from "../NewResume";
import { CoverLetterProps } from "@/types/resume";
import { resumeProps } from "../dashboard/resume-list";
import { CoverLetterItem } from "../cover-letter/cover-letter-item";

type SortOption = "name" | "updated" | "created";
type SortDirection = "asc" | "desc";
type Props = {
  data?: any[];
  isPending: boolean;
  isError: boolean;
  type: "resume" | "cover letter";
};
export function ResumeManagementClient({
  data,
  isPending,
  isError,
  type,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("updated");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  if (isPending) {
    return <LoadingScreen />;
  }
  console.log("data",data)
  if (!data) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <FileText className="h-16 w-16 text-muted-foreground mb-6" />
          <h3 className="text-xl font-medium mb-2">No {type} yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Create your first {type} to showcase your skills and experience to
            potential employers.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Filter resumes based on search query
  const filtered = data.filter((d) =>
    d.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort resumes based on sort options
  const sorted = [...filtered].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "name":
        comparison = a.title.localeCompare(b.title);
        break;
      case "updated":
        comparison =
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        break;
      case "created":
        comparison =
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        break;
      default:
        comparison =
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }

    return sortDirection === "asc" ? -comparison : comparison;
  });

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  return (
    <div className="space-y-6">
      {data.length > 0 ? (
        <>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ">
            <div className="relative w-full sm:w-72 ">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search resumes or cover letter..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9">
                    <Filter className="mr-2 h-4 w-4" />
                    <span>Sort by</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setSortBy("name")}
                    className={cn(sortBy === "name" && "font-medium")}
                  >
                    Name
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSortBy("updated")}
                    className={cn(sortBy === "updated" && "font-medium")}
                  >
                    Last Updated
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSortBy("created")}
                    className={cn(sortBy === "created" && "font-medium")}
                  >
                    Date Created
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                size="sm"
                className="h-9"
                onClick={toggleSortDirection}
              >
                <ArrowUpDown className="mr-2 h-4 w-4" />
                <span>
                  {sortDirection === "asc" ? "Ascending" : "Descending"}
                </span>
              </Button>

              {/* <CreateResumeDialog onCreateResume={handleCreateResume} /> */}
            </div>
          </div>

          <div className="space-y-4">
            {sorted.length > 0 ? (
              type==="resume"?
              sorted.map((resume) => (
                <ResumeItem key={resume.id} resume={resume} />
              )):   sorted.map((coverLetter) => (
                <CoverLetterItem key={coverLetter.id} coverLetter={coverLetter} />
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Search className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No {type} found</h3>
                  <p className="text-muted-foreground mb-4">
                    We couldn't find any {type} matching your search.
                  </p>
                  <Button variant="outline" onClick={() => setSearchQuery("")}>
                    Clear search
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      ) : (
        <Card className="border-0 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="h-16 w-16 text-muted-foreground mb-6" />
            <h3 className="text-xl font-medium mb-2">No {type} yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Create your first {type} to showcase your skills and experience to
              potential employers.
            </p>
            <NewResume type={type} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
