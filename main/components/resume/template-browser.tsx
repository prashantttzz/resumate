"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { templates } from "@/constants";

interface TemplateBrowserProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
  onClose?: () => void;
  isDialog?: boolean;
}

export function TemplateBrowser({
  selectedTemplate,
  onSelectTemplate,
  onClose,
  isDialog = false,
}: TemplateBrowserProps) {
  const [category, setCategory] = useState("");

  const filteredTemplates =
    category === "all"
      ? templates
      : templates.filter((template) => template.categories.includes(category));

  const content = (
    <div className="space-y-6 w-full h-full overflow-auto">
      <Tabs
        defaultValue="all"
        value={category}
        onValueChange={setCategory}
        className="w-full "
      >
        {/* Fixed Top Bar */}
        <div className="sticky top-0 bg-background left-0 w-full z-10 border-b py-4 shadow-sm ">
          <h1 className="px-4 mb-5 text-xl font-se">select a template</h1>
          <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap justify-between items-center">
            <TabsList className="flex flex-wrap gap-2">
              <TabsTrigger value="all">All Templates</TabsTrigger>
              <TabsTrigger value="Professional">Professional</TabsTrigger>
              <TabsTrigger value="Modern">Modern</TabsTrigger>
              <TabsTrigger value="Minimal">Minimal</TabsTrigger>
              <TabsTrigger value="Creative">Creative</TabsTrigger>
              <TabsTrigger value="Technical">Technical</TabsTrigger>
              <TabsTrigger value="Academic">Academic</TabsTrigger>
            </TabsList>

            {isDialog && (
              <div className="flex gap-2">
                <Button onClick={onClose} variant="outline">
                  Cancel
                </Button>
                <Button onClick={onClose} disabled={!selectedTemplate}>
                  Apply Template
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Content below fixed bar */}
        <TabsContent value={category} className=" px-5">
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {filteredTemplates.map((template) => (
              <Card
                key={template.id}
                className={`overflow-hidden rounded-xl border-0 shadow hover:shadow-md transition-all cursor-pointer ${
                  selectedTemplate === template.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => onSelectTemplate(template.id)}
              >
                <div className="relative aspect-[3/4] bg-muted">
                  <img
                    src={template.preview || "/placeholder.svg"}
                    alt={template.name}
                    className="w-full h-full object-cover"
                  />
                  {selectedTemplate === template.id && (
                    <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1 shadow">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm mb-1">
                    {template.name}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {template.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {template.categories.map((cat) => (
                      <Badge
                        key={cat}
                        variant="secondary"
                        className="text-xs lowercase"
                      >
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  if (isDialog) return content;

  return (
    <Dialog >
      <DialogContent className="relative overflow-y-scroll">{content}</DialogContent>
    </Dialog>
  );
}
