// hooks/resume-hooks.ts
import {
  coverLetterCount,
  getAllCoverLetter,
  getCoverLetterById,
  newCoverLetter,
  saveCoverLetter,
} from "@/actions/coverLetter-action";
import {
  changeResumeName,
  deleteResume,
  getAllResume,
  getResumeById,
  getresumeBySlug,
  newResume,
  resumeCount,
  saveResume,
  setSlug,
  updateViewCount,
} from "@/actions/resume-actions";
import { generateCoverletter } from "@/lib/utils";
import { CoverLetterProps, ResumeData } from "@/types/resume";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// --------------------
// QUERY KEYS
// --------------------
export const QUERY_KEYS = {
  RESUME: {
    ALL: ["resumes"] as const,
    BY_ID: (id: string) => ["resume", id] as const,
    BY_SLUG: (slug: string) => ["resume-slug", slug] as const,
    COUNT: ["resume-count"] as const,
  },
  COVER_LETTER: {
    ALL: ["coverletters"] as const,
    BY_ID: (id: string) => ["coverletter", id] as const,
    COUNT: ["coverletter-count"] as const,
  },
};

// --------------------
// RESUME HOOKS
// --------------------
export function useCreateNewResume() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => newResume(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RESUME.ALL });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RESUME.COUNT });
    },
  });
}

export function useGetResumebyId(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.RESUME.BY_ID(id),
    queryFn: () => getResumeById(id),
    enabled: !!id,
  });
}

export function useGetResumeBySlug(slug: string) {
  return useQuery({
    queryKey: QUERY_KEYS.RESUME.BY_SLUG(slug),
    queryFn: () => getresumeBySlug(slug),
  });
}
export function useDeleteResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteResume(id),
    onSuccess: (_, id) => {
      // Invalidate all relevant queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RESUME.ALL });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RESUME.COUNT });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RESUME.BY_ID(id) });
    },
  });
}
export function useGetAllResumes() {
  return useQuery({
    queryKey: QUERY_KEYS.RESUME.ALL,
    queryFn: getAllResume,
  });
}

export function useResumeCount() {
  return useQuery({
    queryKey: QUERY_KEYS.RESUME.COUNT,
    queryFn: resumeCount,
  });
}

export function useSaveResume() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      resume,
      resumeId,
    }: {
      resume: ResumeData;
      resumeId: string;
    }) => saveResume(resume, resumeId),
    onSuccess: (_, { resumeId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RESUME.BY_ID(resumeId) });
    },
  });
}

export function useUpdateTitle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) => changeResumeName({ id, title }),
    onSuccess: (_, { id, title }) => {
      toast.success(`Title changed to ${title}`);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RESUME.BY_ID(id) });
    },
  });
}

export function useSetSlug() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ url, id }: { url: string; id: string }) => setSlug({ url, id }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RESUME.ALL });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RESUME.BY_ID(id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RESUME.BY_SLUG(id) });
    },
  });
}

export function useViewUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (url: string) => updateViewCount(url),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RESUME.ALL });
    },
  });
}

// --------------------
// COVER LETTER HOOKS
// --------------------
export function useCreateNewCoverLetter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => newCoverLetter(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COVER_LETTER.ALL });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COVER_LETTER.COUNT });
    },
  });
}

export function useCoverLetterById(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.COVER_LETTER.BY_ID(id),
    queryFn: () => getCoverLetterById(id),
  });
}

export function useGetAllCoverLetter() {
  return useQuery({
    queryKey: QUERY_KEYS.COVER_LETTER.ALL,
    queryFn: getAllCoverLetter,
  });
}

export function useCoverLetterCount() {
  return useQuery({
    queryKey: QUERY_KEYS.COVER_LETTER.COUNT,
    queryFn: coverLetterCount,
  });
}

export function useSaveCoverLetter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      coverLetter,
      coverLetterId,
    }: {
      coverLetter: CoverLetterProps;
      coverLetterId: string;
    }) => saveCoverLetter(coverLetter, coverLetterId),
    onSuccess: (_, { coverLetterId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COVER_LETTER.BY_ID(coverLetterId) });
    },
  });
}

export function useGetaiCoverLetter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ input, coverLetterId }: { input: CoverLetterProps; coverLetterId: string }) =>
      generateCoverletter({ input, coverLetterId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COVER_LETTER.ALL });
    },
  });
}
