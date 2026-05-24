"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { useAuthStore } from "@/stores/authStore"
import { mockCertificates, mockStudentProgress, mockProjectTemplates, mockUsers } from "@/lib/mockData"
import { InternzaLogo } from "@/components/brand/InternzaLogo"
import {
  Award,
  CheckCircle,
  Copy,
  ExternalLink,
  Share2,
  Download,
  Shield,
  Clock,
  TrendingUp,
  FileText,
  CheckCircle2,
  Link as LinkIcon,
  Briefcase,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import html2canvas from "html2canvas"
import { jsPDF } from "jspdf"

interface CertificateData {
  id: string
  studentId: string
  studentName: string
  projectId: string
  projectName: string
  certificateNumber: string
  issuedAt: Date
  issuedBy: string
  issuedByName: string
  skills: string[]
  tasksCompleted: number
  totalTasks: number
  mentorName?: string
  reviewerName?: string
  completionDate?: Date
  platformName?: string
}

interface ProgressData {
  id: string
  studentId: string
  projectId: string
  enrolledAt: Date
  tasksCompleted: string[]
  currentTaskId?: string
  overallProgress: number
  certificateIssued: boolean
}

// Premium Certificate Preview Component
function CertificatePreview({ cert }: { cert: CertificateData }) {
  const issueDate = new Date(cert.issuedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  })
  
  // Show mentor or reviewer, whichever is available
  const signatureName = cert.mentorName || cert.reviewerName || cert.issuedByName
  const signatureRole = cert.mentorName ? "Mentor" : cert.reviewerName ? "Reviewer" : "Issuing Authority"

  return (
    <div
      id="certificate-preview"
      className="relative w-full bg-white rounded-xl shadow-2xl"
      style={{ minHeight: '380px' }}
    >
      {/* Decorative border frame */}
      <div className="absolute inset-0 border-4 border-double border-primary/20 rounded-xl" />
      <div className="absolute inset-2 border border-primary/10 rounded-lg" />
      
      {/* Corner ornaments with enhanced styling */}
      <div className="absolute top-3 left-3 w-12 h-12 border-t-3 border-l-3 border-primary/40 rounded-tl-lg" />
      <div className="absolute top-3 right-3 w-12 h-12 border-t-3 border-r-3 border-primary/40 rounded-tr-lg" />
      <div className="absolute bottom-3 left-3 w-12 h-12 border-b-3 border-l-3 border-primary/40 rounded-bl-lg" />
      <div className="absolute bottom-3 right-3 w-12 h-12 border-b-3 border-r-3 border-primary/40 rounded-br-lg" />

      {/* Main content */}
      <div className="relative h-full p-4 md:p-8 flex flex-col" style={{ paddingRight: '32px', paddingBottom: '32px' }}>
        {/* Header - Stacked vertically */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img src="/icon.svg" alt="Internza" width="48" height="48" style={{ display: 'inline-block', marginBottom: '12px' }} />
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.025em', lineHeight: '1.2', marginBottom: '4px' }}>Internza</div>
          <div style={{ fontSize: '12px', fontWeight: '500', color: '#64748b', lineHeight: '1.2', marginBottom: '16px' }}>Proof-based internships</div>
          <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: '9999px', border: '1px solid #d1fae5', backgroundColor: '#ecfdf5' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#047857', letterSpacing: '0.025em', lineHeight: '1' }}>✓ VERIFIED</span>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Certificate of Completion
          </h1>
        </div>

        {/* Dynamic Text */}
        <div className="text-center mb-8 px-4">
          <p className="text-base text-slate-700 leading-relaxed mb-4">
            This is to certify that <span className="font-bold text-slate-900">{cert.studentName}</span> has successfully completed the Internza Proof-of-Work Internship Program.
          </p>
          <p className="text-sm text-slate-500 leading-relaxed">
            During this program, the student completed structured project tasks, submitted verifiable proof of work, and received approval from the assigned reviewer and mentor.
          </p>
        </div>

        {/* Details Cards */}
        <div style={{ marginBottom: '32px', paddingLeft: '24px', paddingRight: '24px' }}>
          {/* Project Box */}
          <div style={{ marginBottom: '20px', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
            <div style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '500', color: '#64748b' }}>Project: <span style={{ fontWeight: '600', color: '#0f172a' }}>{cert.projectName}</span></div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#64748b' }}>Skills: <span style={{ fontWeight: '600', color: '#0f172a' }}>{cert.skills.join(", ")}</span></div>
          </div>

          {/* Issue Dates */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1, padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>ISSUE DATE</div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>{issueDate}</div>
            </div>
            <div style={{ flex: 1, padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>CERTIFICATE ID</div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', fontFamily: 'monospace' }}>{cert.certificateNumber}</div>
            </div>
          </div>
        </div>

        {/* Signature */}
        <div style={{ textAlign: 'center', marginBottom: '32px', marginTop: 'auto' }}>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', marginBottom: '6px' }}>{signatureName}</div>
          <div style={{ fontSize: '10px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{signatureRole}</div>
          <div style={{ fontSize: '10px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ISSUED BY INTERNZA</div>
        </div>

        {/* Footer Verify Link with QR Code */}
        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '24px', paddingBottom: '24px', marginTop: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tr style={{ height: '120px' }}>
              <td style={{ width: '55%', verticalAlign: 'middle', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', fontWeight: '500', color: '#64748b', marginBottom: '6px' }}>Verify at</div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a', fontFamily: 'monospace' }}>internza.io/verify/{cert.id}</div>
              </td>
              <td style={{ width: '45%', verticalAlign: 'middle', textAlign: 'right', paddingLeft: '20px', paddingRight: '24px', height: '120px' }}>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://internza.io/verify/${cert.id}`}
                  alt="QR Code"
                  width="100"
                  height="100"
                  style={{ display: 'block', marginLeft: 'auto' }}
                />
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  )
}

// Progress Certificate Component
function ProgressCertificate({
  progress,
  project,
}: {
  progress: ProgressData
  project: { title?: string; skills?: string[]; tasks?: unknown[] } | null
}) {
  const tasksCompleted = progress.tasksCompleted.length
  const totalTasks = project?.tasks?.length || 0
  const progressPercent = totalTasks > 0 ? Math.round((tasksCompleted / totalTasks) * 100) : 0

  return (
    <div className="relative w-full bg-white rounded-xl shadow-xl overflow-hidden">
      {/* Premium gradient background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary-50/50 via-white to-accent/[0.02]" />
      
      {/* Decorative border frame */}
      <div className="absolute inset-0 border-4 border-double border-secondary-200 rounded-xl" />
      <div className="absolute inset-2 border border-secondary-100 rounded-lg" />
      
      {/* Corner ornaments */}
      <div className="absolute top-3 left-3 w-12 h-12 border-t-3 border-l-3 border-secondary-300 rounded-tl-lg" />
      <div className="absolute top-3 right-3 w-12 h-12 border-t-3 border-r-3 border-secondary-300 rounded-tr-lg" />
      <div className="absolute bottom-3 left-3 w-12 h-12 border-b-3 border-l-3 border-secondary-300 rounded-bl-lg" />
      <div className="absolute bottom-3 right-3 w-12 h-12 border-b-3 border-r-3 border-secondary-300 rounded-br-lg" />

      {/* Main content */}
      <div className="relative p-5 md:p-8 flex flex-col">
        {/* Header with Logo and Badge */}
        <div className="flex items-start justify-between mb-3">
          <InternzaLogo className="scale-100" />
          <div className="flex flex-col items-end">
            <Badge className="gap-1.5 px-3 py-1 text-[11px] font-bold bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 border-amber-300 shadow-sm">
              <Clock className="h-3 w-3" />
              IN PROGRESS
            </Badge>
          </div>
        </div>

        {/* Certificate Title */}
        <div className="text-center mb-4">
          <h1 className="text-xl md:text-2xl font-display font-bold text-primary tracking-tight mb-2">
            Certificate Preview
          </h1>
          <div className="flex items-center justify-center gap-2">
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-secondary-300 to-transparent" />
            <Award className="h-4 w-4 text-secondary-300" />
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-secondary-300 to-transparent" />
          </div>
        </div>

        {/* Project Info */}
        <div className="text-center mb-4">
          <p className="text-xs text-secondary-600 uppercase tracking-wider mb-2 font-medium">Currently working on</p>
          <h3 className="text-lg md:text-xl font-display font-semibold text-primary mb-2">
            {project?.title || "Unknown Project"}
          </h3>
          <div className="flex flex-wrap justify-center gap-1.5">
            {project?.skills?.slice(0, 4).map((skill: string) => (
              <span 
                key={skill} 
                className="px-2.5 py-0.5 text-[11px] font-medium bg-secondary-100 text-secondary-700 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Progress Visualization */}
        <div className="space-y-3 mb-4 p-4 bg-gradient-to-br from-secondary-50/80 to-white rounded-lg border border-secondary-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-secondary-600 font-medium">Overall Progress</span>
            <span className="font-bold text-primary text-lg">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
          <div className="flex items-center justify-between text-xs text-secondary-500">
            <span>{tasksCompleted} of {totalTasks} tasks completed</span>
            <span className="font-medium text-amber-600">{totalTasks - tasksCompleted} remaining</span>
          </div>
        </div>

        {/* Spacer reduced */}
        <div className="flex-1 min-h-[8px]" />

        {/* CTA */}
        <div className="flex justify-center pt-2">
          <Button className="gap-2 bg-primary hover:bg-primary/90 px-8 shadow-md">
            <TrendingUp className="h-4 w-4" />
            Continue Project
          </Button>
        </div>
      </div>
    </div>
  )
}

// Summary Stats Card
function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  trend, 
  className 
}: { 
  icon: LucideIcon
  label: string
  value: string | number
  trend?: string
  className?: string 
}) {
  return (
    <Card className={cn("border-0 shadow-sm hover:shadow-md transition-shadow", className)}>
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <div className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            "bg-gradient-to-br from-primary/10 to-accent/10"
          )}>
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-secondary-500 uppercase tracking-wider">{label}</p>
            <p className="text-2xl font-display font-bold text-primary mt-1">{value}</p>
            {trend && (
              <p className="text-xs text-accent-600 mt-1">{trend}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function VerificationPage() {
  const { user } = useAuthStore()
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Get current user's data
  const currentUser = user || mockUsers[0]
  
  // Get certificates for current student
  const myCertificates = mockCertificates.filter(
    cert => cert.studentId === currentUser?.id || cert.studentName === currentUser?.name
  )

  // Get in-progress projects
  const myProgress = mockStudentProgress.filter(
    prog => prog.studentId === currentUser?.id
  )

  // Get project details for in-progress items
  const inProgressItems = myProgress.map(prog => ({
    progress: prog,
    project: mockProjectTemplates.find(t => t.id === prog.projectId)
  })).filter(item => item.project && !item.progress.certificateIssued)

  const hasCertificate = myCertificates.length > 0
  const hasInProgress = inProgressItems.length > 0

  // Calculate stats
  const totalTasksCompleted = myCertificates.reduce((sum, cert) => sum + cert.tasksCompleted, 0) +
    inProgressItems.reduce((sum, item) => sum + item.progress.tasksCompleted.length, 0)
  
  const totalMilestones = myCertificates.length + inProgressItems.length
  const verifiedCertificates = myCertificates.length

  const handleCopyLink = (certId: string) => {
    const link = `https://internza.io/verify/${certId}`
    navigator.clipboard.writeText(link)
    setCopiedId(certId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleDownloadCertificate = async (cert: CertificateData) => {
    const certificateElement = document.getElementById('certificate-preview')
    if (!certificateElement) return

    try {
      // Capture the certificate as an image
      const canvas = await html2canvas(certificateElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        allowTaint: true,
      })

      // Create PDF with proper dimensions
      const imgData = canvas.toDataURL('image/png', 1.0)
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      
      console.log('PDF dimensions:', pdfWidth, 'x', pdfHeight)
      console.log('Image dimensions:', imgWidth, 'x', imgHeight)
      
      // Calculate ratio to fit within PDF margins
      const margin = 10
      const availableWidth = pdfWidth - (margin * 2)
      const availableHeight = pdfHeight - (margin * 2)
      const ratio = Math.min(availableWidth / imgWidth, availableHeight / imgHeight)
      
      const finalWidth = imgWidth * ratio
      const finalHeight = imgHeight * ratio
      const imgX = (pdfWidth - finalWidth) / 2
      const imgY = (pdfHeight - finalHeight) / 2

      pdf.addImage(imgData, 'PNG', imgX, imgY, finalWidth, finalHeight)
      pdf.save(`certificate-${cert.certificateNumber}.pdf`)
      console.log('PDF saved successfully')
    } catch (error) {
      console.error('Error generating PDF:', error)
      // Fallback to text download if canvas fails
      const certContent = `
INTERNZA CERTIFICATE OF COMPLETION

Certificate Number: ${cert.certificateNumber}

This certifies that

${cert.studentName}

has successfully completed

${cert.projectName}

Skills acquired: ${cert.skills.join(", ")}
Tasks completed: ${cert.tasksCompleted}/${cert.totalTasks}

Issued on: ${new Date(cert.issuedAt).toLocaleDateString()}
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
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-display font-bold text-primary">Verification</h1>
        <p className="text-secondary-600 max-w-2xl">
          View your verified credentials and track progress toward earning certificates. 
          Each certificate is cryptographically signed and publicly verifiable.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={Award}
          label="Certificates"
          value={verifiedCertificates}
          trend={verifiedCertificates > 0 ? "Verified" : "None yet"}
        />
        <StatCard 
          icon={CheckCircle2}
          label="Tasks Completed"
          value={totalTasksCompleted}
        />
        <StatCard 
          icon={FileText}
          label="Projects"
          value={totalMilestones}
          trend={inProgressItems.length > 0 ? `${inProgressItems.length} in progress` : ""}
        />
        <StatCard 
          icon={Shield}
          label="Verification"
          value="Active"
          trend="Publicly verifiable"
        />
      </div>

      {/* Trust Banner */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/5 via-primary/[0.02] to-accent/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="font-semibold text-primary">Blockchain-Verified Credentials</h3>
              <p className="text-sm text-secondary-600">
                All Internza certificates are cryptographically signed and permanently verifiable. 
                Employers can verify authenticity instantly using the unique verification link or QR code.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      {hasCertificate ? (
        <div className="space-y-6">
          {/* Certificate Preview Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-primary">Your Certificate</h2>
              {myCertificates.length > 1 && (
                <div className="flex gap-2">
                  {myCertificates.map((cert, idx) => (
                    <button
                      key={cert.id}
                      className={cn(
                        "w-2 h-2 rounded-full transition-colors",
                        idx === 0 ? "bg-primary" : "bg-secondary-300"
                      )}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Certificate Preview */}
            <CertificatePreview cert={myCertificates[0]} />

            {/* Verification Details Panel */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LinkIcon className="h-5 w-5" />
                  Verification Details
                </CardTitle>
                <CardDescription>
                  Share this certificate with employers or verify it publicly
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Certificate Details */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-primary flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Certificate Details
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-secondary-50 rounded-lg">
                      <p className="text-xs text-secondary-500 mb-1">Certificate ID</p>
                      <p className="text-sm font-bold text-primary font-mono">{myCertificates[0].certificateNumber}</p>
                    </div>
                    <div className="p-3 bg-secondary-50 rounded-lg">
                      <p className="text-xs text-secondary-500 mb-1">Student Name</p>
                      <p className="text-sm font-bold text-primary">{myCertificates[0].studentName}</p>
                    </div>
                    <div className="p-3 bg-secondary-50 rounded-lg">
                      <p className="text-xs text-secondary-500 mb-1">Project Name</p>
                      <p className="text-sm font-bold text-primary">{myCertificates[0].projectName}</p>
                    </div>
                    <div className="p-3 bg-secondary-50 rounded-lg">
                      <p className="text-xs text-secondary-500 mb-1">Issue Date</p>
                      <p className="text-sm font-bold text-primary">{new Date(myCertificates[0].issuedAt).toLocaleDateString()}</p>
                    </div>
                    <div className="p-3 bg-secondary-50 rounded-lg">
                      <p className="text-xs text-secondary-500 mb-1">Issuer/Mentor/Reviewer</p>
                      <p className="text-sm font-bold text-primary">{myCertificates[0].issuedByName}</p>
                    </div>
                    <div className="p-3 bg-secondary-50 rounded-lg">
                      <p className="text-xs text-secondary-500 mb-1">Verification Status</p>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                        <p className="text-sm font-bold text-emerald-600">Verified</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Verification Link */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary">Public Verification Link</label>
                  <div className="flex gap-2">
                    <Input
                      value={`https://internza.io/verify/${myCertificates[0].id}`}
                      readOnly
                      className="flex-1 bg-secondary-50 text-secondary-600 font-mono text-sm"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleCopyLink(myCertificates[0].id)}
                      className={copiedId === myCertificates[0].id ? "bg-emerald-50 border-emerald-200 text-emerald-700" : ""}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => window.open(`https://internza.io/verify/${myCertificates[0].id}`, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                  {copiedId === myCertificates[0].id && (
                    <p className="text-sm text-emerald-600 flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Link copied to clipboard!
                    </p>
                  )}
                </div>

                {/* Proof Summary */}
                <div className="pt-4 border-t border-secondary-200">
                  <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Certificate Proof Summary
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 bg-secondary-50 rounded-lg">
                      <p className="text-xs text-secondary-500">Tasks Completed</p>
                      <p className="text-lg font-bold text-primary">{myCertificates[0].tasksCompleted}/{myCertificates[0].totalTasks}</p>
                    </div>
                    <div className="p-3 bg-secondary-50 rounded-lg">
                      <p className="text-xs text-secondary-500">Skills Verified</p>
                      <p className="text-lg font-bold text-primary">{myCertificates[0].skills.length}</p>
                    </div>
                    <div className="p-3 bg-secondary-50 rounded-lg">
                      <p className="text-xs text-secondary-500">Reviewer Approval</p>
                      <p className="text-lg font-bold text-accent">Approved</p>
                    </div>
                    <div className="p-3 bg-secondary-50 rounded-lg">
                      <p className="text-xs text-secondary-500">Status</p>
                      <p className="text-lg font-bold text-emerald-600">Verified</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-secondary-200">
                  <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Actions
                  </h4>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() => handleDownloadCertificate(myCertificates[0])}
                    >
                      <Download className="h-4 w-4" />
                      Download Certificate (PDF)
                    </Button>
                    <Button variant="outline" className="w-full gap-2">
                      <Share2 className="h-4 w-4" />
                      Share on LinkedIn
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Public Verification Notice */}
            <Card className="border border-accent/20 bg-accent/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                    <Shield className="h-4 w-4 text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-primary">This certificate can be verified publicly</p>
                    <p className="text-xs text-secondary-600 mt-1">
                      Anyone with the verification link can confirm the authenticity of this certificate without requiring access to your account.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : hasInProgress ? (
        /* In Progress State */
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-primary">Your Progress</h2>
            
            {inProgressItems.map((item) => (
              <div key={item.progress.id} className="space-y-4">
                <ProgressCertificate progress={item.progress} project={item.project ?? null} />
                
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-5">
                    <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Progress Details
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-secondary-600">Tasks Completed</span>
                        <span className="font-medium text-primary">{item.progress.tasksCompleted.length} / {item.project?.tasks?.length || 0}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-secondary-600">Current Task</span>
                        <span className="font-medium text-primary">
                          {item.project?.tasks?.find(t => t.id === item.progress.currentTaskId)?.title || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-secondary-600">Reviewer Status</span>
                        <Badge variant="pending" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      </div>
                    </div>
                    <Button className="w-full mt-4 gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Continue Working
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Empty State */
        <Card className="border-0 shadow-lg">
          <CardContent className="py-16 text-center">
            <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-secondary-100 mb-6">
              <Award className="h-10 w-10 text-secondary-400" />
            </div>
            <h3 className="text-xl font-semibold text-primary mb-2">No certificates yet</h3>
            <p className="text-secondary-600 max-w-md mx-auto mb-6">
              Complete an internship project to earn your first verified certificate. 
              Each certificate demonstrates your skills and is publicly verifiable.
            </p>
            <Button className="gap-2">
              <Briefcase className="h-4 w-4" />
              Browse Internships
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
