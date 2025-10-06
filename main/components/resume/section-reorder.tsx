"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Grip } from "lucide-react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type ResumeSection = {
  title: string
  type: string
  isActive: boolean
}

interface SectionReorderProps {
  sections: ResumeSection[]
  onReorder: (sections: ResumeSection[]) => void
  onToggleSection: (id: string, isActive: boolean) => void
}

export function SectionReorder({ sections, onReorder, onToggleSection }: SectionReorderProps) {
  const [sectionList, setSectionList] = useState<ResumeSection[]>(sections)

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(sectionList)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setSectionList(items)
    onReorder(items)
  }

  const toggleSection = (title: string) => {
    const updatedSections = sectionList.map((section) =>
      section.title === title ? { ...section, isActive: !section.isActive } : section,
    )
    setSectionList(updatedSections)

    const section = sectionList.find((s) => s.title === title)
    if (section) {
      onToggleSection(title, !section.isActive)
    }
  }
  console.log("sec",sectionList)
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Reorder Sections</h3>
        <p className="text-sm text-muted-foreground">Drag and drop to reorder sections</p>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="resume-sections">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
              {sectionList.map((section, index) => (
                <Draggable key={section.title} draggableId={section.title} index={index}>
                  {(provided, snapshot) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={cn(
                        "border-0 shadow-sm transition-all",
                        snapshot.isDragging ? "ring-2 ring-primary" : "",
                        !section.isActive && "opacity-60",
                      )}
                    >
                      <CardContent className="p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing">
                            <Grip className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <span className="font-medium">{section.title}</span>
                            <Badge variant="outline" className="ml-2 text-xs">
                              {section.type}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant={section.isActive ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleSection(section.title)}
                          className="min-w-[80px]"
                        >
                          {section.isActive ? (
                            <>
                              <Check className="mr-1 h-3 w-3" /> Active
                            </>
                          ) : (
                            "Inactive"
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}
