"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const jobDetailSchema = z.object({
  companyName: z.string().min(1, "company Name is required"),
  jobTitle: z.string().min(2,'job title required').max(50, "job title is required"),
  hiringManager: z.string().optional(),
});

export type jobDetailValues = z.infer<typeof jobDetailSchema>;

interface PersonalInfoCoverLetterFormProps {
  defaultValues: jobDetailValues;
  onSubmit: (values: jobDetailValues) => void;
}

export default function JobDetailsForm({
  defaultValues,
  onSubmit,
}: PersonalInfoCoverLetterFormProps) {
  const form = useForm<jobDetailValues>({
    resolver: zodResolver(jobDetailSchema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h2 className="text-xl font-medium text-white mb-1">Job Details</h2>
          <p className="text-sm text-gray-200">
            Enter information about the position you're applying for{" "}
          </p>
        </div>

        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-white">
                Company Name <span className="text-gray-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter your company name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="jobTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-white">
                Job title
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter your job title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hiringManager"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-white">
                hiring Manager (optional)
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter hiring manager's name if known"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="absolute right-6 bottom-6 bg-white text-black items-center justify-center flex gap-4"
        >
          next
          <ArrowRight />
        </Button>
      </form>
    </Form>
  );
}
