"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, ExternalLink, Grip, Plus, Trash2 } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { EntryType } from "@/types/resume"

interface SectionEntriesProps {
  sectionId: string
  entries: EntryType[]
  onAddEntry: (sectionId: string, entry: EntryType) => void
  onUpdateEntry: (sectionId: string, entryId: string, entry: Partial<EntryType>) => void
  onDeleteEntry: (sectionId: string, entryId: string) => void
  onReorderEntries: (sectionId: string, startIndex: number, endIndex: number) => void
  isLoading?: boolean
}

export function SectionEntries({
  sectionId,
  entries,
  onAddEntry,
  onUpdateEntry,
  onDeleteEntry,
  onReorderEntries,
  isLoading = false,
}: SectionEntriesProps) {
  const [newEntry, setNewEntry] = useState<Partial<EntryType>>({
    title: "",
    description: "",
    date: "",
    link: "",
  })
  const [date, setDate] = useState<Date | undefined>()

  const handleAddEntry = () => {
    if (!newEntry.title || !newEntry.description) return

    const entry: EntryType = {
      id: uuidv4(),
      title: newEntry.title || "",
      description: newEntry.description || "",
      date: newEntry.date || "",
      link: newEntry.link||'',
    }

    onAddEntry(sectionId, entry)
    setNewEntry({
      title: "",
      description: "",
      date: "",
      link: "",
    })
    setDate(undefined)
  }

  const handleDateSelect = (date: Date | undefined) => {
    setDate(date)
    if (date) {
      setNewEntry({
        ...newEntry,
        date: format(date, "PPP"),
      })
    } else {
      setNewEntry({
        ...newEntry,
        date: "",
      })
    }
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return
    onReorderEntries(sectionId, result.source.index, result.destination.index)
  }

  return (
    <div className="space-y-4">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId={`section-${sectionId}`}>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
              {entries.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground text-sm border border-dashed rounded-md">
                  No entries yet. Add your first entry below.
                </div>
              ) : (
                entries.map((entry, index) => (
                  <Draggable key={entry.id} draggableId={entry.id} index={index} isDragDisabled={isLoading}>
                    {(provided, snapshot) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={cn(
                          "border shadow-sm",
                          snapshot.isDragging && "ring-2 ring-primary ring-opacity-50",
                          isLoading && "opacity-70",
                        )}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start gap-3">
                            <div
                              {...provided.dragHandleProps}
                              className={cn(
                                "mt-1 text-muted-foreground",
                                isLoading ? "cursor-not-allowed" : "cursor-grab active:cursor-grabbing",
                              )}
                            >
                              <Grip className="h-5 w-5" />
                            </div>
                            <div className="flex-1 space-y-3">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <Label htmlFor={`entry-title-${entry.id}`} className="text-xs">
                                    Title
                                  </Label>
                                  <Input
                                    id={`entry-title-${entry.id}`}
                                    value={entry.title||""}
                                    onChange={(e) => onUpdateEntry(sectionId, entry.id, { title: e.target.value })}
                                    placeholder="Entry title"
                                    className="h-8"
                                    disabled={isLoading}
                                  />
                                </div>
                                <div className="space-y-1">
                                  <Label htmlFor={`entry-date-${entry.id}`} className="text-xs">
                                    Date
                                  </Label>
                                  <Input
                                    id={`entry-date-${entry.id}`}
                                    value={entry.date||''}
                                    onChange={(e) => onUpdateEntry(sectionId, entry.id, { date: e.target.value })}
                                    placeholder="Date (e.g., May 2023)"
                                    className="h-8"
                                    disabled={isLoading}
                                  />
                                </div>
                              </div>
                              <div className="space-y-1">
                                <Label htmlFor={`entry-description-${entry.id}`} className="text-xs">
                                  Description
                                </Label>
                                <Textarea
                                  id={`entry-description-${entry.id}`}
                                  value={entry.description||''}
                                  onChange={(e) => onUpdateEntry(sectionId, entry.id, { description: e.target.value })}
                                  placeholder="Brief description"
                                  className="min-h-[60px]"
                                  disabled={isLoading}
                                />
                              </div>
                              <div className="space-y-1">
                                <Label htmlFor={`entry-link-${entry.id}`} className="text-xs">
                                  Link (optional)
                                </Label>
                                <div className="flex items-center gap-2">
                                  <Input
                                    id={`entry-link-${entry.id}`}
                                    value={entry.link || ""}
                                    onChange={(e) => onUpdateEntry(sectionId, entry.id, { link: e.target.value })}
                                    placeholder="https://example.com"
                                    className="h-8"
                                    disabled={isLoading}
                                  />
                                  {entry.link && (
                                    <a
                                      href={entry.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={cn(
                                        "text-primary hover:text-primary/80",
                                        isLoading && "pointer-events-none opacity-50",
                                      )}
                                    >
                                      <ExternalLink className="h-4 w-4" />
                                      <span className="sr-only">Open link</span>
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onDeleteEntry(sectionId, entry.id)}
                              className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 h-8 w-8"
                              disabled={isLoading}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete entry</span>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="pt-3 border-t">
        <h4 className="text-sm font-medium mb-3">Add New Entry</h4>
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="new-entry-title" className="text-xs">
                Title
              </Label>
              <Input
                id="new-entry-title"
                value={newEntry.title || ""}
                onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                placeholder="Entry title"
                className="h-9"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new-entry-date" className="text-xs">
                Date
              </Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal h-9", !date && "text-muted-foreground")}
                      disabled={isLoading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent mode="single" selected={date} onSelect={handleDateSelect} initialFocus />
                  </PopoverContent>
                </Popover>
                <Input
                  id="new-entry-date"
                  value={newEntry.date || ""}
                  onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                  placeholder="Or type date"
                  className="h-9"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="new-entry-description" className="text-xs">
              Description
            </Label>
            <Textarea
              id="new-entry-description"
              value={newEntry.description || ""}
              onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
              placeholder="Brief description"
              className="min-h-[80px]"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="new-entry-link" className="text-xs">
              Link (optional)
            </Label>
            <Input
              id="new-entry-link"
              value={newEntry.link || ""}
              onChange={(e) => setNewEntry({ ...newEntry, link: e.target.value })}
              placeholder="https://example.com"
              className="h-9"
              disabled={isLoading}
            />
          </div>
          <Button
            onClick={handleAddEntry}
            className="gap-2 w-full"
            disabled={isLoading || !newEntry.title || !newEntry.description}
          >
            <Plus className="h-4 w-4" />
            Add Entry
          </Button>
        </div>
      </div>
    </div>
  )
}
