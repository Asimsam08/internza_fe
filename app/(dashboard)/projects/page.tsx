"use client"

import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CheckCircle2, Search, SlidersHorizontal, Loader2 } from "lucide-react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useProjectTemplates } from "@/lib/hooks/use-student"

const categoryLabels: Record<string, string> = {
  ai_ml: "AI/ML",
  frontend: "Frontend",
  backend: "Backend",
  fullstack: "Fullstack",
  devops: "DevOps",
}

export default function ProjectsPage() {
  const { data: projectTemplates = [], isLoading } = useProjectTemplates()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [activeDifficulty, setActiveDifficulty] = useState("All")
  const [sort, setSort] = useState<"recommended" | "newest" | "duration">("recommended")

  const categories = [
    "All",
    ...Array.from(
      new Set(projectTemplates.map((t) => categoryLabels[t.category] ?? t.category))
    ).sort(),
  ]

  const difficulties = ["All", "Beginner", "Intermediate", "Advanced"] as const

  const filteredProjects = projectTemplates
    .filter((t) => t.isPublished)
    .filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))

      const categoryLabel = categoryLabels[t.category] ?? t.category
      const matchesCategory = activeCategory === "All" || categoryLabel === activeCategory
      const matchesDifficulty = activeDifficulty === "All" || t.difficulty === activeDifficulty
      return matchesSearch && matchesCategory && matchesDifficulty
    })
    .sort((a, b) => {
      if (sort === "newest") {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return bTime - aTime
      }
      if (sort === "duration") return a.duration - b.duration
      // recommended: stable by title for now (swap for analytics later)
      return a.title.localeCompare(b.title)
    })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-sm text-secondary-600">Loading projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      {/* <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/5 via-primary/[0.02] to-accent/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 flex-shrink-0">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-primary mb-2">Browse & Explore</h3>
              <p className="text-sm text-secondary-600 mb-3">
                This is a project catalog for exploration. To start an internship, go to the{" "}
                <a href="/internship" className="text-primary font-semibold hover:underline">
                  Internships
                </a>{" "}
                page to select your duration and get a personalized plan.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = "/internship"}
              >
                Go to Internships
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card> */}

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">Project Catalog</h1>
          <p className="mt-1 text-sm text-secondary-500">
            Browse available projects. Add projects to your plan or explore to find what interests you.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm font-semibold text-secondary-600">
            {filteredProjects.length} available
          </div>
          <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommended">Recommended</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="duration">Duration</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Search and filters */}
      <Card className="border-secondary-200">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
                <Input
                  type="text"
                  placeholder="Search by title, skill, or description"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-secondary-600">
                <SlidersHorizontal className="h-4 w-4 text-secondary-500" />
                Filters
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={[
                    "rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors border",
                    activeCategory === category
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-secondary-700 hover:bg-secondary-50 border-secondary-200",
                  ].join(" ")}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-secondary-500">Difficulty</span>
              {difficulties.map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setActiveDifficulty(difficulty)}
                  className={[
                    "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors border",
                    activeDifficulty === difficulty
                      ? "bg-secondary-900 text-white border-secondary-900"
                      : "bg-white text-secondary-600 hover:bg-secondary-50 border-secondary-200",
                  ].join(" ")}
                >
                  {difficulty}
                </button>
              ))}
              {(searchQuery || activeCategory !== "All" || activeDifficulty !== "All") && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto"
                  onClick={() => {
                    setSearchQuery("")
                    setActiveCategory("All")
                    setActiveDifficulty("All")
                  }}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((t) => {
            const categoryLabel = categoryLabels[t.category] ?? t.category
            return (
              <Card
                key={t.id}
                className="group overflow-hidden border-secondary-200 bg-white hover:shadow-lg transition-all hover:border-primary/20"
              >
                <div className="relative aspect-video overflow-hidden bg-secondary-100">
                  <Image
                    src={t.imageUrl || `https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=450&fit=crop`}
                    alt={t.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    priority={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/0 to-black/0" />

                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    <Badge className="bg-white/90 text-secondary-800 border-0 text-xs font-semibold transition-colors hover:bg-white/95 hover:text-secondary-900">
                      {categoryLabel}
                    </Badge>
                    <Badge className="bg-white/90 text-secondary-800 border-0 text-xs font-semibold transition-colors hover:bg-white/95 hover:text-secondary-900">
                      {t.duration} weeks
                    </Badge>
                    <Badge
                      className={[
                        "border-0 text-xs font-semibold transition-colors",
                        t.difficulty === "Beginner"
                          ? "bg-accent/90 text-white hover:bg-accent"
                          : t.difficulty === "Intermediate"
                            ? "bg-warning/90 text-white hover:bg-warning"
                            : "bg-primary/90 text-white hover:bg-primary",
                      ].join(" ")}
                    >
                      {t.difficulty}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-secondary-900 leading-6 line-clamp-2">
                      {t.title}
                    </h3>
                    <Badge className="shrink-0 bg-accent/10 text-accent-700 border-0 text-xs font-semibold">
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                      Proof-based
                    </Badge>
                  </div>

                  <p className="mt-2 text-sm text-secondary-600 line-clamp-2">
                    {t.shortDescription}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {t.skills.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md bg-secondary-50 px-2 py-1 text-xs font-semibold text-secondary-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Link href={`/internships/${t.id}`} className="flex-1">
                      <Button size="sm" className="w-full gap-1">
                        View details <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => window.location.href = "/internship"}
                    >
                      Add to Plan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="border-secondary-200">
          <CardContent className="py-14 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary-100">
              <Search className="h-6 w-6 text-secondary-500" />
            </div>
            <div className="text-lg font-semibold text-secondary-900">No projects found</div>
            <p className="mt-1 text-sm text-secondary-500">
              Try adjusting your search or clearing filters.
            </p>
            <Button
              variant="outline"
              className="mt-5"
              onClick={() => {
                setSearchQuery("")
                setActiveCategory("All")
                setActiveDifficulty("All")
              }}
            >
              Clear filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
