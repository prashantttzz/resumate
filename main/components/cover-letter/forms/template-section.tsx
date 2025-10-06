"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const templateSchema = z.object({
  template: z.string().min(1, "Template selection is required"),
});

export type TemplateValues = z.infer<typeof templateSchema>;

interface TemplateSelectionFormProps {
  defaultValues: TemplateValues;
  onSubmit: (values: TemplateValues) => void;
}

export default function TemplateSelectionForm({
  defaultValues,
  onSubmit,
}: TemplateSelectionFormProps) {
  const form = useForm<TemplateValues>({
    resolver: zodResolver(templateSchema),
    defaultValues,
  });

  const templates = [
    {
      id: "minimal",
      name: "Minimal",
      description: "Clean and simple design with modern typography",
    },
    {
      id: "classic",
      name: "Classic",
      description: "Traditional format with formal spacing and structure",
    },
    {
      id: "modern",
      name: "Modern",
      description: "Contemporary layout with subtle design elements",
    },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h2 className="text-xl font-medium text-white mb-1">
            Template Selection
          </h2>
          <p className="text-sm text-muted-foreground">
            Choose a template style for your cover letter
          </p>
        </div>
        <FormField
          control={form.control}
          name="template"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Templates</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="grid gap-4"
                >
                  {templates.map((template) => (
                    <FormItem
                      key={template.id}
                      className={`flex items-start space-x-3 border rounded-lg p-4 transition-colors ${
                        field.value === template.id
                          ? "border-black bg-gray-50 text-black"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <FormControl>
                        <RadioGroupItem
                          value={template.id}
                          id={template.id}
                          className="mt-1"
                        />
                      </FormControl>
                      <div>
                        <Label
                          htmlFor={template.id}
                          className="text-base font-medium cursor-pointer"
                        >
                          {template.name}
                        </Label>
                        <p className="text-sm text-muted-foreground mt-1">
                          {template.description}
                        </p>
                      </div>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="absolute right-6 bottom-6 bg-white text-black items-center justify-center flex gap-4"
        >
          Save
          <ArrowRight />
        </Button>{" "}
      </form>
    </Form>
  );
}
