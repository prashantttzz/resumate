"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {  WandSparkles } from "lucide-react";
import { callResumeAI } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Loader from "@/components/Loader";

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  jobTitle: z.string().min(2, {
    message: "Job title must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(5, {
    message: "Phone number must be at least 5 characters.",
  }),
  address: z
    .string()
    .optional(),
  website: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .optional()
    .or(z.literal("")),
  github: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .optional()
    .or(z.literal("")),
  linkedin: z
    .string()
    .url({
      message: "Please enter a valid LinkedIn URL.",
    })
    .optional()
    .or(z.literal("")),
  summary: z.string().min(10, {
    message: "Summary must be at least 10 characters.",
  }),
});

export type PersonalInfoFormValues = z.infer<typeof formSchema>;

interface PersonalInfoFormProps {
  defaultValues: Partial<PersonalInfoFormValues>;
  onSubmit: (values: PersonalInfoFormValues) => void;
}

export function PersonalInfoForm({
  defaultValues,
  onSubmit,
}: PersonalInfoFormProps) {
  const form = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      fullName: "John Doe",
      jobTitle: "Software Engineer",
      email: "john@example.com",
      phone: "(123) 456-7890",
      address: "San Francisco, CA",
      website: "https://johndoe.com",
      linkedin: "https://linkedin.com/in/johndoe",
      github:"https://github/johndoe",
      summary:
        "Experienced software engineer with a passion for building scalable web applications and solving complex problems.",
    },
  });

  const [loading, setLoading] = useState(false);

  const handlesummary = async (aiPrompt:string) => {
    try {
      setLoading(true);
      const aisummary = await callResumeAI(aiPrompt, "summary");
      form.setValue("summary", aisummary);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
      toast.success('generated successfully')
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
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
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input placeholder="Software Engineer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="(123) 456-7890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="San Francisco, CA" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input placeholder="https://johndoe.com" {...field} />
                </FormControl>
                <FormDescription>Optional</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="linkedin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://linkedin.com/in/johndoe"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Optional</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="github"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Github</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://github.com/in/johndoe"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Optional</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex justify-between items-center">
                Professional Summary
              </FormLabel>
              <FormControl>
              <div className="relative ">
                    <div className="bg-background rounded-2xl border p-2 pb-10 ">
                      <textarea
                        placeholder="Describe your responsibilities and achievements..."
                        className="bg-transparent border-none outline-none ring-0 resize-none focus:outline-none focus:ring-0 focus:border-none focus:bg-transparent focus:shadow-none hover:outline-none hover:ring-0 hover:border-none hover:shadow-none hover:bg-transparent scrollbar-custom min-h-[200px] w-full text-sm p-2"
                        {...field}
                      />
                    </div>
                    <Tooltip>
                      <TooltipTrigger type="button"
                        disabled={!field.value || field.value.trim() === ""}
                        className="absolute bottom-3 right-3 disabled:cursor-not-allowed"
                        onClick={() => handlesummary(field.value ?? "")}
                      >
                        {loading ? (
                          <Loader />
                        ) : !field.value || field.value.trim() === "" ? (
                          <WandSparkles className="h-5 w-5 text-gray-400" />
                        ) : (
                          <WandSparkles className="h-5 w-5 " />
                        )}
                      </TooltipTrigger>
                      <TooltipContent>
                        {!field.value || field.value.trim() === ""
                          ? "prompt is too short"
                          : "enhance with ai"}
                      </TooltipContent>
                    </Tooltip>
                  </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
     <div className="flex  justify-end">
         <Button type="submit" className="hover-lift ">
          Save & Continue
        </Button>
     </div>
      </form>
    </Form>
  );
}
