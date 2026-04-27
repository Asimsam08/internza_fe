"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useAuthStore } from "@/stores/authStore"
import { mockCertificates, mockStudentProgress, mockProjectTemplates, mockUsers } from "@/lib/mockData"
import { CheckCircle, Award, Download, Eye, Search } from "lucide-react"

export default function CertificatesPage() {
  const canIssueCertificate = useAuthStore((state) => state.canIssueCertificate())
  const isStudent = useAuthStore((state) => state.isStudent())
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
  const [isIssuing, setIsIssuing] = useState(false)

  const handleDownload = (cert: typeof mockCertificates[0]) => {
    const certContent = `
INTERNZA CERTIFICATE

Certificate Number: ${cert.certificateNumber}

This certifies that

${cert.studentName}

has successfully completed

${cert.projectName}

Skills acquired: ${cert.skills.join(", ")}
Tasks completed: ${cert.tasksCompleted}/${cert.totalTasks}

Issued on: ${new Date(cert.issuedAt).toISOString().split('T')[0]}
Issued by: ${cert.issuedByName}

Verify at: https://internza.io/verify/${cert.id}
    `.trim()

    const blob = new Blob([certContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `certificate-${cert.certificateNumber}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Filter students who have completed projects
  const eligibleStudents = mockUsers.filter(u => u.role === "student").map(student => {
    const progress = mockStudentProgress.filter(sp => sp.studentId === student.id)
    const completedProjects = progress.filter(p => p.overallProgress === 100 && !p.certificateIssued)
    return {
      ...student,
      completedCount: completedProjects.length,
      eligibleProjects: completedProjects
    }
  }).filter(s => s.completedCount > 0)

  const filteredStudents = eligibleStudents.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Student view - their certificates
  if (isStudent) {
    // For demo: show all certificates if student has none
    const myCertificates = mockCertificates

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">My Certificates</h1>
          <p className="text-secondary-600">View and download your verified certificates</p>
        </div>

        {myCertificates.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {myCertificates.map((cert) => (
              <Card key={cert.id} className="border-secondary-200">
                <CardHeader className="flex flex-row items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                    <Award className="h-6 w-6 text-accent" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{cert.projectName}</CardTitle>
                    <CardDescription>Issued by {cert.issuedByName}</CardDescription>
                  </div>
                  <Badge variant="success">Active</Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-secondary-500">Certificate #</p>
                        <p className="font-medium">{cert.certificateNumber}</p>
                      </div>
                      <div>
                        <p className="text-secondary-500">Issued Date</p>
                        <p className="font-medium">{new Date(cert.issuedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-secondary-500 text-sm">Skills</p>
                      <p className="font-semibold text-accent">{cert.skills.slice(0, 3).join(", ")}{cert.skills.length > 3 ? "..." : ""}</p>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" className="flex-1 gap-2" size="sm">
                        <Eye className="h-4 w-4" />
                        Preview
                      </Button>
                      <Button 
                        className="flex-1 gap-2" 
                        size="sm"
                        onClick={() => handleDownload(cert)}
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-secondary-200">
            <CardContent className="py-12 text-center">
              <Award className="h-16 w-16 mx-auto text-secondary-300 mb-4" />
              <h3 className="text-lg font-semibold text-secondary-900">No certificates yet</h3>
              <p className="text-secondary-500 mt-1">Complete projects to earn verified certificates</p>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  // Teacher/Admin view - issue certificates
  if (canIssueCertificate) {
    return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Issue Certificates</h1>
        <p className="text-secondary-600">Certify students who have completed their projects</p>
      </div>

      <Card className="border-secondary-200">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
              <Input
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredStudents.length > 0 ? (
            <div className="space-y-4">
              {filteredStudents.map((student) => (
                <div key={student.id} className="p-4 border border-secondary-200 rounded-lg">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-medium text-primary">{student.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-secondary-900">{student.name}</p>
                        <p className="text-sm text-secondary-500">{student.email}</p>
                        <p className="text-sm text-accent-600 mt-1">
                          {student.completedCount} project(s) ready for certification
                        </p>
                      </div>
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => setSelectedStudent(selectedStudent === student.id ? null : student.id)}
                    >
                      {selectedStudent === student.id ? "Hide" : "View Projects"}
                    </Button>
                  </div>

                  {selectedStudent === student.id && (
                    <div className="mt-4 pl-14 space-y-3">
                      {student.eligibleProjects.map((proj) => {
                        const project = mockProjectTemplates.find(p => p.id === proj.projectId)
                        return (
                          <div key={proj.projectId} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                            <div>
                              <p className="font-medium text-secondary-900">{project?.title}</p>
                              <p className="text-sm text-secondary-500">
                                {proj.tasksCompleted.length} tasks completed
                              </p>
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline"
                              disabled={isIssuing}
                              onClick={() => {
                                setIsIssuing(true)
                                setTimeout(() => {
                                  setIsIssuing(false)
                                  alert(`Certificate issued for ${student.name}`)
                                }, 1000)
                              }}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Issue Certificate
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-secondary-500">No students eligible for certificates</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
  }

  // Default/Demo: Show student view with sample certificates
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">My Certificates</h1>
        <p className="text-secondary-600">View and download your verified certificates</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {mockCertificates.map((cert) => (
          <Card key={cert.id} className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-secondary-900 truncate">{cert.projectName}</h3>
                  <p className="text-sm text-secondary-500">{cert.certificateNumber}</p>
                  <Badge className="mt-2 bg-emerald-100 text-emerald-700">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-secondary-100">
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-secondary-500">Issued On</p>
                    <p className="font-medium text-secondary-900">{new Date(cert.issuedAt).toISOString().split('T')[0]}</p>
                  </div>
                  <div>
                    <p className="text-secondary-500">Issued By</p>
                    <p className="font-medium text-secondary-900">{cert.issuedByName}</p>
                  </div>
                </div>
                <Button onClick={() => handleDownload(cert)} className="w-full gap-2">
                  <Download className="h-4 w-4" />
                  Download Certificate
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
