"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Check } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skill, SkillCategory } from "@/types/resume"


interface SkillsFormProps {
  defaultValues?: SkillCategory[]
  onSubmit: (values: SkillCategory[]) => void
}

export function SkillsForm({ defaultValues = [], onSubmit }: SkillsFormProps) {
  const [categories, setCategories] = useState<SkillCategory[]>(
    defaultValues.length > 0
      ? defaultValues
      : [
          {
            name: "Programming Languages",
            skills: [
              { name: "JavaScript" },
              { name: "TypeScript" },
              { name: "Python"},
            ],
          },
          {
            name: "Frameworks & Libraries",
            skills: [
              { name: "React" },
              { name: "Node.js" },
              { name: "Next.js" },
            ],
          },
        ],
  )
  const [newCategory, setNewCategory] = useState("")
  const [newSkill, setNewSkill] = useState("")
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0)
  const [isFormDirty, setIsFormDirty] = useState(false)

  useEffect(() => {
    setIsFormDirty(true)
  }, [categories])

  function addCategory() {
    if (newCategory.trim() === "") return

    setCategories([...categories, { name: newCategory, skills: [] }])
    setNewCategory("")
    setSelectedCategoryIndex(categories.length)
    setIsFormDirty(true)
  }

  function deleteCategory(index: number) {
    const updatedCategories = categories.filter((_, i) => i !== index)
    setCategories(updatedCategories)
     onSubmit(updatedCategories)
    if (selectedCategoryIndex === index) {
      setSelectedCategoryIndex(0)
    } else if (selectedCategoryIndex > index) {
      setSelectedCategoryIndex(selectedCategoryIndex - 1)
    }

    setIsFormDirty(true)
  }

  function addSkill() {
    if (newSkill.trim() === "" || categories.length === 0) return

    const updatedCategories = [...categories]
    updatedCategories[selectedCategoryIndex].skills.push({
      name: newSkill,
    })

    setCategories(updatedCategories)
    setNewSkill("")
    onSubmit(updatedCategories)
    setIsFormDirty(true)
  }

  function deleteSkill(categoryIndex: number, skillIndex: number) {
    const updatedCategories = [...categories]
    updatedCategories[categoryIndex].skills = updatedCategories[categoryIndex].skills.filter((_, i) => i !== skillIndex)
    setCategories(updatedCategories)
    onSubmit(updatedCategories)
    setIsFormDirty(true)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {categories.map((category, categoryIndex) => (
          <Card key={categoryIndex} className="border-0 bg-secondary/50 shadow-sm hover:bg-secondary/80 transition-all">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">{category.name}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full text-muted-foreground hover:text-destructive"
                  onClick={() => deleteCategory(categoryIndex)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <Badge
                    key={skillIndex}
                    variant="secondary"
                    className="flex items-center gap-1 px-2 py-1 hover:bg-secondary"
                  >
                    <span>{skill.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 p-0 text-muted-foreground hover:text-destructive"
                      onClick={() => deleteSkill(categoryIndex, skillIndex)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4 border-t pt-4">
        <h3 className="text-lg font-medium">Add Skills</h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <div className="flex gap-2">
                <Select
                  value={selectedCategoryIndex.toString()}
                  onValueChange={(value) => setSelectedCategoryIndex(Number.parseInt(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">New Category</label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Tools & Technologies"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <Button onClick={addCategory} className="hover-lift" disabled={!newCategory.trim()}>
                  Add
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-12">
            <div className="space-y-2">
              <label className="text-sm font-medium">Skill</label>
              <Input placeholder="e.g., React" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} />
            </div>
            <Button
              className="w-full hover-lift"
              onClick={addSkill}
              disabled={!newSkill.trim() || categories.length === 0}
            >
              Add Skill
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
