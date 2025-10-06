"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const personalInfoSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(5, "Phone number must be at least 5 digits"),
})

export type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>

interface PersonalInfoCoverLetterFormProps {
  defaultValues: PersonalInfoFormValues
  onSubmit: (values: PersonalInfoFormValues) => void
}

export default function PersonalInfoCoverLetterForm({
  defaultValues,
  onSubmit,
}: PersonalInfoCoverLetterFormProps) {
  const form = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues,
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <div>
          <h2 className="text-xl font-medium text-white mb-1">Personal Information</h2>
          <p className="text-sm text-gray-200">
            Enter your contact details for the cover letter header
          </p>
        </div>

        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-white">
                Full Name <span className="text-gray-500">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-white">
                Email Address
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter your email address" {...field} />
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
              <FormLabel className="text-sm font-medium text-white">
                Phone Number
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter your phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
          <Button type="submit" className="absolute right-6 bottom-6 bg-white text-black items-center justify-center flex gap-4">
          next
          <ArrowRight/>
        </Button>
      </form>
    </Form>
  )
}
