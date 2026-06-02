"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  useCohortDetail,
  useCohortStudents,
  useCollegeDashboard,
  type CohortStudent,
} from "@/lib/hooks/use-college-admin"
import { cn } from "@/lib/utils"
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle2,
  Award,
  Clock,
  Loader2,
  Search,
  Users,
} from "lucide-react"
import { CohortCertificatesSection } from "@/components/certificates/CohortCertificatesSection"

function statusBadge(status: string) {
  const map: Record<string, string> = {
    ACTIVE: "bg-emerald-100 text-emerald-900 border-emerald-200",
    DRAFT: "bg-amber-100 text-amber-900 border-amber-200",
    COMPLETED: "bg-blue-100 text-blue-900 border-blue-200",
    ARCHIVED: "bg-secondary-100 text-secondary-700 border-secondary-200",
  }
  const label = status === "ACTIVE" ? "Live" : status.charAt(0) + status.slice(1).toLowerCase()
  return (
    <Badge className={cn("hover:opacity-90", map[status] ?? "bg-secondary-100")}>{label}</Badge>
  )
}

function studentProgress(student: CohortStudent) {
  if (!student.plan) return { label: "Not started", className: "text-secondary-500" }
  if (student.plan.isCompleted) return { label: "Completed", className: "text-emerald-700" }
  return {
    label: `${student.plan.completedWeeks}/${student.plan.totalWeeks} weeks`,
    className: "text-primary-700",
  }
}

export default function CohortDetailPage() {
  const collegeId = useParams()?.collegeId as string
  const cohortId = useParams()?.cohortId as string
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  const { data: cohort, isLoading, isError } = useCohortDetail(collegeId, cohortId)
  const { data: dashboard } = useCollegeDashboard(collegeId)
  const { data: students = [], isLoading: studentsLoading } = useCohortStudents(
    collegeId,
    cohortId,
    debouncedSearch,
  )

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  const tasks = useMemo(() => cohort?.template?.templateTasks ?? [], [cohort])
  const college = dashboard?.college as { name?: string; logoUrl?: string | null } | undefined
  const reviewerNames = cohort?.reviewers?.map((r) => r.name).filter(Boolean).join(", ")

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (isError || !cohort) {
    return (
      <div className="space-y-4 text-center py-12">
        <p className="text-red-600">Could not load cohort details.</p>
        <Button asChild variant="outline">
          <Link href={`/admin/colleges/${collegeId}`}>Back to overview</Link>
        </Button>
      </div>
    )
  }

  return (
    <section className="space-y-6 max-w-6xl">
      <header className="space-y-4">
        <Button asChild variant="ghost" size="sm" className="gap-2 -ml-2">
          <Link href={`/admin/colleges/${collegeId}`}>
            <ArrowLeft className="h-4 w-4" />
            Back to cohorts
          </Link>
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-secondary-900 truncate">{cohort.name}</h1>
              {statusBadge(cohort.status)}
            </div>
            <p className="text-secondary-600 mt-1">{cohort.template.title}</p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-secondary-500">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {new Date(cohort.startDate).toLocaleDateString()} –{" "}
                {new Date(cohort.endDate).toLocaleDateString()}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                {cohort.studentsTotal} students · {cohort.studentsCompleted} completed
              </span>
            </div>
          </div>
        </div>
      </header>

      <Tabs defaultValue="students" className="w-full">
        <TabsList>
          <TabsTrigger value="students" className="gap-2">
            <Users className="h-4 w-4" />
            Students
          </TabsTrigger>
          <TabsTrigger value="project" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Project
          </TabsTrigger>
          <TabsTrigger value="certificates" className="gap-2">
            <Award className="h-4 w-4" />
            Certificates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="mt-4 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="overflow-hidden rounded-xl border border-secondary-200 bg-white">
            {studentsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : students.length === 0 ? (
              <p className="py-12 text-center text-secondary-500 text-sm">
                {debouncedSearch ? "No students match your search." : "No students enrolled yet."}
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-secondary-50/80 text-left text-secondary-600">
                    <th className="px-4 py-3 font-medium">Student</th>
                    <th className="px-4 py-3 font-medium hidden sm:table-cell">Email</th>
                    <th className="px-4 py-3 font-medium hidden md:table-cell">University</th>
                    <th className="px-4 py-3 font-medium">Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => {
                    const progress = studentProgress(s)
                    return (
                      <tr
                        key={s.id}
                        className="border-b border-secondary-100 last:border-0 hover:bg-secondary-50/50"
                      >
                        <td className="px-4 py-3">
                          <p className="font-medium text-secondary-900">
                            {s.firstName} {s.lastName}
                          </p>
                          {s.externalStudentId ? (
                            <p className="text-xs text-secondary-500 mt-0.5">ID: {s.externalStudentId}</p>
                          ) : null}
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell text-secondary-700">{s.email}</td>
                        <td className="px-4 py-3 hidden md:table-cell text-secondary-600">
                          {s.university ?? "—"}
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn("font-medium text-sm", progress.className)}>
                            {progress.label}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </TabsContent>

        <TabsContent value="project" className="mt-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{cohort.template.title}</CardTitle>
              <CardDescription>{cohort.template.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{cohort.template.category}</Badge>
                <Badge variant="outline">{cohort.template.difficulty}</Badge>
                <Badge variant="secondary">{cohort.template.duration} weeks</Badge>
              </div>
              {cohort.template.skills?.length > 0 ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-secondary-500 mb-2">
                    Skills
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {cohort.template.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md bg-secondary-100 px-2 py-1 text-xs font-medium text-secondary-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
              {cohort.template.techStack?.length > 0 ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-secondary-500 mb-2">
                    Tech stack
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {cohort.template.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md bg-primary/5 px-2 py-1 text-xs font-medium text-primary-800"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Project tasks
              </CardTitle>
              <CardDescription>
                {tasks.length} task{tasks.length === 1 ? "" : "s"} in this internship program
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tasks.length === 0 ? (
                <p className="text-sm text-secondary-500">No tasks defined for this template.</p>
              ) : (
                <ol className="space-y-3">
                  {tasks.map((task) => (
                    <li
                      key={task.id}
                      className="flex gap-4 rounded-lg border border-secondary-200 bg-secondary-50/30 p-4"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                        {task.order}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-secondary-900">{task.title}</p>
                        <p className="mt-1 text-sm text-secondary-600 line-clamp-2">
                          {task.description}
                        </p>
                        <p className="mt-2 inline-flex items-center gap-1 text-xs text-secondary-500">
                          <Clock className="h-3.5 w-3.5" />
                          {task.durationDays} day{task.durationDays === 1 ? "" : "s"}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificates" className="mt-4">
          <CohortCertificatesSection
            collegeId={collegeId}
            cohortId={cohortId}
            cohortName={cohort.name}
            collegeName={college?.name ?? "Your College"}
            collegeLogoUrl={college?.logoUrl}
            programName={cohort.template.title}
            reviewerNames={reviewerNames}
            studentsCompleted={cohort.studentsCompleted}
            studentsTotal={cohort.studentsTotal}
          />
        </TabsContent>
      </Tabs>
    </section>
  )
}
