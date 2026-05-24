// Types for Internza MVP
// Focused on core flow: Templates → Enrollment → Tasks → Proof → Review → Certificate

export type UserRole = "super_admin" | "college_admin" | "reviewer" | "student"

export type TaskStatus = 
  | "locked" 
  | "available" 
  | "in_progress" 
  | "submitted" 
  | "changes_requested"
  | "approved" 
  | "done"

export type ProofType = 
  | "pr_link" 
  | "commit_hash" 
  | "screenshot" 
  | "file_upload" 
  | "description"

export interface User {
  id: string
  email: string
  name?: string
  avatar?: string
  profileImagePath?: string
  role: UserRole
  university?: string
  collegeId?: string | null
  isActive?: boolean
  college?: {
    id: string
    name: string
    domain?: string
    logoUrl?: string | null
  } | null
  createdAt: Date
  updatedAt: Date
  studentProfile?: {
    firstName: string
    lastName: string
    university: string
    graduationYear: number
    gradYear?: number
    bio?: string
    phone?: string
    linkedIn?: string
    github?: string
  }
  reviewerProfile?: {
    firstName: string
    lastName: string
    company: string
    designation: string
  }
}

export type ProjectCategory = 
  | "ai_ml" 
  | "frontend" 
  | "backend" 
  | "mobile_app" 
  | "fullstack"

export interface ProjectTemplate {
  id: string
  title: string
  category: ProjectCategory
  description: string
  shortDescription: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  duration: string
  image: string
  skills: string[]
  techStack: string[]
  figmaLink?: string
  createdBy: string
  createdAt: Date
  tasks: Task[]
  isPublished: boolean
}

export interface Task {
  id: string
  title: string
  description: string
  expectedOutput: string
  order: number
  proofRequirements: ProofRequirement[]
  status?: TaskStatus
  dependencies?: string[]
}

export interface ProofRequirement {
  type: ProofType
  description: string
  required: boolean
}

export interface ProofSubmission {
  id: string
  taskId: string
  projectId: string
  studentId: string
  prLink?: string
  commitHash?: string
  screenshots: string[]
  files: string[]
  description: string
  notes?: string
  status: "pending" | "approved" | "changes_requested"
  reviewerFeedback?: string
  submittedAt: Date
  reviewedAt?: Date
}

export interface StudentProgress {
  id: string
  studentId: string
  projectId: string
  enrolledAt: Date
  tasksCompleted: string[]
  currentTaskId?: string
  overallProgress: number
  certificateIssued: boolean
}

export interface Certificate {
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

export interface ReviewTask {
  id: string
  submissionId: string
  taskId: string
  taskTitle: string
  projectId: string
  projectName: string
  studentId: string
  studentName: string
  reviewerId?: string
  reviewerName?: string
  status: "pending" | "approved" | "changes_requested"
  submittedAt: Date
  reviewedAt?: Date
  reviewerFeedback?: string
  proofData: {
    prLink?: string
    commitHash?: string
    screenshots: string[]
    description: string
  }
}

export interface PlatformStats {
  totalStudents: number
  totalReviewers: number
  totalProjects: number
  totalCertificates: number
  pendingReviews: number
}

export type Permission = 
  | "create_project"
  | "edit_project"
  | "delete_project"
  | "review_submissions"
  | "approve_submissions"
  | "reject_submissions"
  | "issue_certificate"
  | "manage_users"

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  super_admin: [
    "create_project", "edit_project", "delete_project",
    "review_submissions", "approve_submissions", "reject_submissions",
    "issue_certificate", "manage_users"
  ],
  college_admin: ["issue_certificate", "manage_users"],
  reviewer: [
    "review_submissions", "approve_submissions", "reject_submissions"
  ],
  student: []
}

// Duration-based internship types
export type DurationType = "4_weeks" | "8_weeks" | "12_weeks" | "custom"

export type MilestoneStatus = "locked" | "available" | "in_progress" | "completed" | "skipped"

export interface DurationOption {
  value: DurationType
  label: string
  weeks: number
  description: string
  popular?: boolean
}

// Duration Rules Engine Configuration
export interface DurationRule {
  durationType: DurationType
  totalWeeks: number
  allowedCombinations: number[][] // Array of week combinations, e.g., [[4], [4,4], [8]]
  description: string
}

export interface ProjectBlock {
  id: string
  projectId: string
  projectTitle: string
  duration: number // in weeks
  order: number
  status: MilestoneStatus
  enrolledAt?: Date
  completedAt?: Date
  approvedAt?: Date
}

export interface InternshipPlan {
  id: string
  studentId: string
  durationType: DurationType
  totalWeeks: number
  projectBlocks: ProjectBlock[]
  startedAt?: Date
  completedAt?: Date
  certificateUnlocked: boolean
  certificateIssuedAt?: Date
}

export interface DurationProgress {
  planId: string
  completedWeeks: number
  totalWeeks: number
  percentage: number
  currentBlock?: ProjectBlock
  nextBlock?: ProjectBlock
  canUnlockCertificate: boolean
  sequentialCompletion: boolean
}

// Project Catalog Types
export interface ProjectCatalogItem {
  id: string
  projectId: string
  title: string
  shortOutcome: string
  duration: number // in weeks
  skills: string[]
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  prerequisites: string[]
  deliverablesPreview: string[]
  isAvailableForPlan: boolean
}

// Plan Builder Types
export interface PlanOption {
  id: string
  combination: number[]
  blocks: Omit<ProjectBlock, "status" | "enrolledAt" | "completedAt" | "approvedAt">[]
  totalWeeks: number
  description: string
  recommended: boolean
}

export interface EligibilityCheck {
  isEligible: boolean
  reason?: string
  missingRequirements?: string[]
}
