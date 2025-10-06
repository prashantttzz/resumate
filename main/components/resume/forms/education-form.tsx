"use client"

import { useState, useEffect, useRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2, Check } from "lucide-react"

const educationSchema = z.object({
  degree: z.string().min(2, {
    message: "Degree must be at least 2 characters.",
  }),
  institution: z.string().min(2, {
    message: "institution name must be at least 2 characters.",
  }),
  location: z.string().optional(),
  startDate: z.string().min(1, {
    message: "Start date is required.",
  }),
  endDate: z.string().optional(),
  description: z.string().nullable(),
})

export type EducationFormValues = z.infer<typeof educationSchema>

interface EducationFormProps {
  defaultValues?: EducationFormValues[]
  onSubmit: (values: EducationFormValues[]) => void
}

export function EducationForm({ defaultValues = [], onSubmit }: EducationFormProps) {
  const [educations, setEducations] = useState<EducationFormValues[]>(defaultValues)

  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [isFormDirty, setIsFormDirty] = useState(false)
      const formRef = useRef<HTMLDivElement>(null);

  const form = useForm<EducationFormValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      degree: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  })

  // Watch for form changes to track if it's dirty
  useEffect(() => {
    const subscription = form.watch(() => {
      setIsFormDirty(form.formState.isDirty)
    })
    return () => subscription.unsubscribe()
  }, [form, form.watch, form.formState.isDirty])

  function handleAddOrUpdate(values: EducationFormValues) {
    if (editIndex !== null) {
      // Update existing education
      const updatedEducations = [...educations]
      updatedEducations[editIndex] = values
      setEducations(updatedEducations)
      setEditIndex(null)
      onSubmit(updatedEducations);
    } else {
      const newEducation =[...educations, values]
      setEducations(newEducation)
      onSubmit(newEducation);
    }

    form.reset({
      degree: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
    })

    setIsFormDirty(false)
  }

  function editEducation(index: number) {
    const education = educations[index]
    form.reset(education)
    setEditIndex(index)
    setIsFormDirty(false)
        setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  }

  function deleteEducation(index: number) {
    const updatedEducations = educations.filter((_, i) => i !== index)
    setEducations(updatedEducations)
    onSubmit(updatedEducations)
    if (editIndex === index) {
      setEditIndex(null)
      form.reset({
        degree: "",
        institution: "",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
      })
      setIsFormDirty(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {educations.map((education, index) => (
          <Card key={index} className="border-0 bg-secondary/50 shadow-sm hover:bg-secondary/80 transition-all">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">{education.degree}</h4>
                  <p className="text-sm text-muted-foreground">
                    {education.institution} {education.location ? `• ${education.location}` : ""}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(education.startDate).toLocaleDateString("en-US", { year: "numeric", month: "short" })} -
                    {education.endDate
                      ? ` ${new Date(education.endDate).toLocaleDateString("en-US", { year: "numeric", month: "short" })}`
                      : ""}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-full"
                    onClick={() => editEducation(index)}
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
                    onClick={() => deleteEducation(index)}
                  >
                    <span className="sr-only">Delete</span>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {education.description && <p className="text-sm mt-2">{education.description}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleAddOrUpdate)} className="space-y-4 border-t pt-4">
          <h3 className="text-lg font-medium">{editIndex !== null ? "Edit Education" : "Add Education"}</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="degree"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Degree</FormLabel>
                  <FormControl>
                    <Input placeholder="Bachelor of Science in Computer Science" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="institution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>institution</FormLabel>
                  <FormControl>
                    <Input placeholder="University of California, Berkeley" {...field} />
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
                  <Input placeholder="Berkeley, CA" {...field} />
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
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date (or Expected)</FormLabel>
                  <FormControl>
                    <Input type="month" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Relevant coursework, achievements, activities..."
                    className="min-h-[100px] resize-none"
                    {...field}
                   value={field.value ?? ""}

                  />
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
                  setEditIndex(null)
                  form.reset({
                    degree: "",
                    institution: "",
                    location: "",
                    startDate: "",
                    endDate: "",
                    description: "",
                  })
                  setIsFormDirty(false)
                }}
                className="hover-lift"
              >
                Cancel
              </Button>
            )}
            <Button type="submit" className="hover-lift" disabled={!isFormDirty}>
              <Plus className="mr-2 h-4 w-4" />
              {editIndex !== null ? "Update Education" : "Add Education"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
