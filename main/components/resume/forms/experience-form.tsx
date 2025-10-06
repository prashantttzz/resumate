"use client";

import { useState, useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus,
  Trash2,
  Check,
  Sparkles,
  Grip,
  WandSparkles,
} from "lucide-react";
import { callResumeAI } from "@/lib/utils";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Loader from "@/components/Loader";

const experienceSchema = z.object({
  position: z.string().min(2, {
    message: "Job title must be at least 2 characters.",
  }),
  company: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  location: z.string().optional(),
  startDate: z.string().min(1, {
    message: "Start date is required.",
  }),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
  description: z
    .string()
    .min(10, {
      message: "Description must be at least 10 characters.",
    })
    .optional(),
});

export type ExperienceFormValues = z.infer<typeof experienceSchema>;

interface ExperienceFormProps {
  defaultValues?: ExperienceFormValues[];
  onSubmit: (values: ExperienceFormValues[]) => void;
}

export function ExperienceForm({
  defaultValues = [],
  onSubmit,
}: ExperienceFormProps) {
  const [experiences, setExperiences] = useState<ExperienceFormValues[]>(defaultValues);

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const haandleDescription = async (aiPrompt: string) => {
    try {
      setLoading(true);
      const aidescription = await callResumeAI(aiPrompt, "job-desc");
      form.setValue("description", aidescription);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
      toast.success("generated successfully");
    }
  };

  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      position: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    },
  });

  useEffect(() => {
    const subscription = form.watch(() => {
      setIsFormDirty(form.formState.isDirty);
    });
    return () => subscription.unsubscribe();
  }, [form, form.watch, form.formState.isDirty]);

  function handleAddOrUpdate(values: ExperienceFormValues) {
    if (editIndex !== null) {
      // Update existing experience
      const updatedExperiences = [...experiences];
      updatedExperiences[editIndex] = values;
      setExperiences(updatedExperiences);
      setEditIndex(null);
      onSubmit(updatedExperiences);
    } else {
      const newExperiences = [...experiences, values];
      setExperiences(newExperiences);
      onSubmit(newExperiences);
    }

    form.reset({
      position: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    });

    setIsFormDirty(false);
  }

  function editExperience(index: number) {
    const experience = experiences[index];
    form.reset(experience);
    setEditIndex(index);
    setIsFormDirty(false);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  }

  function deleteExperience(index: number) {
    const updatedExperiences = experiences.filter((_, i) => i !== index);
    setExperiences(updatedExperiences);
      onSubmit(updatedExperiences);
    if (editIndex === index) {
      setEditIndex(null);
      form.reset({
        position: "",
        company: "",
        location: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      });
      setIsFormDirty(false);
    }
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const reordered = Array.from(experiences);
    const [movedItem] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, movedItem);
    setExperiences(reordered);
    onSubmit(reordered);
  };
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="projects">
            {(provided: any) => (
              <div
                className="space-y-4"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {experiences.map((exp, index) => (
                  <Draggable
                    key={exp.company ?? index}
                    draggableId={String(exp.company ?? index)}
                    index={index}
                  >
                    {(dragProps: any) => (
                      <div
                        ref={dragProps.innerRef}
                        {...dragProps.draggableProps}
                        {...dragProps.dragHandleProps}
                      >
                        <Card className="border-0 bg-secondary/50 shadow-sm hover:bg-secondary/80 transition-all">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <div className="flex gap-5 items-center justify-center mb-5">
                                  <Grip className="h-5 w-5 text-muted-foreground" />

                                  <h4 className="font-medium">{exp.company}</h4>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {exp.position}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(exp.startDate).toLocaleDateString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "short",
                                    }
                                  )}{" "}
                                  -
                                  {exp.current
                                    ? " Present"
                                    : exp.endDate
                                    ? ` ${new Date(
                                        exp.endDate
                                      ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                      })}`
                                    : ""}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 rounded-full"
                                  onClick={() => editExperience(index)}
                                >
                                  <span className="sr-only">Edit</span>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                    <path d="m15 5 4 4" />
                                  </svg>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 rounded-full text-destructive"
                                  onClick={() => deleteExperience(index)}
                                >
                                  <span className="sr-only">Delete</span>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm mt-2">{exp.description}</p>
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleAddOrUpdate)}
          className="space-y-4 border-t pt-4"
        >
          <h3 className="text-lg font-medium">
            {editIndex !== null ? "Edit Experience" : "Add Experience"}
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="position"
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
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Inc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="San Francisco, CA" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2" ref={formRef}>
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input type="month" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-4">
              {!form.watch("current") && (
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="month" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="current"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-6">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          if (checked) {
                            form.setValue("endDate", "");
                          }
                        }}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>I currently work here</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center justify-between">
                  Description
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
                      <TooltipTrigger
                        type="button"
                        disabled={!field.value || field.value.trim() === ""}
                        className="absolute bottom-3 right-3 disabled:cursor-not-allowed"
                        onClick={() => haandleDescription(field.value ?? "")}
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
          <div className="flex justify-end gap-2">
            {editIndex !== null && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditIndex(null);
                  form.reset({
                    position: "",
                    company: "",
                    location: "",
                    startDate: "",
                    endDate: "",
                    current: false,
                    description: "",
                  });
                  setIsFormDirty(false);
                }}
                className="hover-lift"
              >
                Cancel
              </Button>
            )}
            <Button type="submit" className="hover-lift">
              <Plus className="mr-2 h-4 w-4" />
              {editIndex !== null ? "Update Experience" : "Add Experience"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
