// Mock Data for Internza MVP
import {
  User,
  ProjectTemplate,
  StudentProgress,
  ProofSubmission,
  ReviewTask,
  Certificate,
  PlatformStats,
  DurationOption,
  InternshipPlan,
  ProjectBlock,
  DurationProgress,
  ProjectCatalogItem,
} from "./types"

// Helper function to create dates
const date = (offsetDays = 0) => {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return d
}

// Users with different roles
export const mockUsers: User[] = [
  {
    id: "user-1",
    email: "student@example.com",
    name: "Alex Student",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop",
    role: "student",
    university: "Stanford",
    createdAt: date(-180),
    updatedAt: date(-30),
  },
  {
    id: "user-2",
    email: "reviewer@example.com",
    name: "Jordan Reviewer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&h=128&fit=crop",
    role: "reviewer",
    createdAt: date(-365),
    updatedAt: date(-10),
  },
  {
    id: "user-3",
    email: "admin@example.com",
    name: "Sam Admin",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop",
    role: "super_admin",
    createdAt: date(-500),
    updatedAt: date(-5),
  },
]

// MVP Project Templates (simplified - no milestones/subtasks)
export const mockProjectTemplates: ProjectTemplate[] = [
  {
    id: "template-1",
    title: "AI/ML Image Classifier",
    category: "ai_ml",
    description: "Build an image classification model using TensorFlow. Learn neural networks, data preprocessing, and model deployment.",
    shortDescription: "Build an AI image classifier with TensorFlow",
    difficulty: "Intermediate",
    duration: "4 weeks",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop",
    skills: ["Python", "TensorFlow", "Machine Learning", "Data Science"],
    techStack: ["Python", "TensorFlow", "Keras", "NumPy", "Pandas"],
    figmaLink: "https://figma.com/template-1",
    createdBy: "user-3",
    createdAt: date(-60),
    isPublished: true,
    tasks: [
      {
        id: "task-1-1",
        title: "Setup Development Environment",
        description: "Install Python, TensorFlow, and set up your Jupyter notebook environment.",
        expectedOutput: "Working Python environment with TensorFlow installed",
        order: 1,
        proofRequirements: [
          { type: "description", description: "Screenshot showing TensorFlow version check", required: true },
        ],
      },
      {
        id: "task-1-2",
        title: "Data Preprocessing",
        description: "Download and preprocess the CIFAR-10 dataset. Normalize and augment the images.",
        expectedOutput: "Preprocessed dataset ready for training",
        order: 2,
        proofRequirements: [
          { type: "pr_link", description: "Link to your PR", required: true },
          { type: "screenshot", description: "Screenshot showing your work", required: true },
          { type: "description", description: "Brief description of what you did", required: true },
        ],
        dependencies: ["task-1-1"],
      },
      {
        id: "task-1-3",
        title: "Build CNN Model",
        description: "Create a Convolutional Neural Network architecture for image classification.",
        expectedOutput: "Defined CNN model architecture",
        order: 3,
        proofRequirements: [
          { type: "pr_link", description: "Link to your PR", required: true },
          { type: "screenshot", description: "Screenshot showing your work", required: true },
          { type: "description", description: "Brief description of what you did", required: true },
        ],
        dependencies: ["task-1-2"],
      },
      {
        id: "task-1-4",
        title: "Train and Evaluate",
        description: "Train your model and evaluate accuracy on the test set.",
        expectedOutput: "Trained model with >70% accuracy",
        order: 4,
        proofRequirements: [
          { type: "pr_link", description: "Link to your PR", required: true },
          { type: "screenshot", description: "Screenshot showing your work", required: true },
          { type: "description", description: "Brief description of what you did", required: true },
        ],
        dependencies: ["task-1-3"],
      },
    ],
  },
  {
    id: "template-2",
    title: "E-commerce Frontend",
    category: "frontend",
    description: "Build a modern e-commerce frontend with React, TypeScript, and Tailwind CSS.",
    shortDescription: "Modern React e-commerce UI",
    difficulty: "Beginner",
    duration: "3 weeks",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
    skills: ["React", "TypeScript", "Tailwind CSS", "UI/UX Design"],
    techStack: ["React", "TypeScript", "Tailwind CSS", "Vite"],
    figmaLink: "https://figma.com/template-2",
    createdBy: "user-3",
    createdAt: date(-45),
    isPublished: true,
    tasks: [
      {
        id: "task-2-1",
        title: "Initialize Project",
        description: "Set up React project with TypeScript and Tailwind CSS.",
        expectedOutput: "Working project structure",
        order: 1,
        proofRequirements: [
          { type: "pr_link", description: "Link to initial commit/PR", required: true },
          { type: "description", description: "Screenshot of running app", required: true },
        ],
      },
      {
        id: "task-2-2",
        title: "Build Product List",
        description: "Create the product listing page with filters and search.",
        expectedOutput: "Functional product list component",
        order: 2,
        proofRequirements: [
          { type: "pr_link", description: "Link to your PR", required: true },
          { type: "screenshot", description: "Screenshot showing your work", required: true },
          { type: "description", description: "Brief description of what you did", required: true },
        ],
        dependencies: ["task-2-1"],
      },
      {
        id: "task-2-3",
        title: "Shopping Cart",
        description: "Implement shopping cart functionality with add/remove items.",
        expectedOutput: "Working shopping cart",
        order: 3,
        proofRequirements: [
          { type: "pr_link", description: "Link to your PR", required: true },
          { type: "screenshot", description: "Screenshot showing your work", required: true },
          { type: "description", description: "Brief description of what you did", required: true },
        ],
        dependencies: ["task-2-2"],
      },
    ],
  },
  {
    id: "template-3",
    title: "REST API Backend",
    category: "backend",
    description: "Build a secure REST API with Node.js, Express, and MongoDB.",
    shortDescription: "Node.js REST API with authentication",
    difficulty: "Intermediate",
    duration: "4 weeks",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
    skills: ["Node.js", "Express", "MongoDB", "JWT", "API Design"],
    techStack: ["Node.js", "Express", "MongoDB", "Mongoose", "JWT"],
    createdBy: "user-3",
    createdAt: date(-30),
    isPublished: true,
    tasks: [
      {
        id: "task-3-1",
        title: "Setup Server",
        description: "Initialize Express server with basic middleware.",
        expectedOutput: "Running Express server",
        order: 1,
        proofRequirements: [
          { type: "pr_link", description: "Link to your PR", required: true },
          { type: "screenshot", description: "Screenshot showing your work", required: true },
          { type: "description", description: "Brief description of what you did", required: true },
        ],
      },
      {
        id: "task-3-2",
        title: "Database Schema",
        description: "Design and implement MongoDB schemas.",
        expectedOutput: "Defined Mongoose models",
        order: 2,
        proofRequirements: [
          { type: "pr_link", description: "Link to your PR", required: true },
          { type: "screenshot", description: "Screenshot showing your work", required: true },
          { type: "description", description: "Brief description of what you did", required: true },
        ],
        dependencies: ["task-3-1"],
      },
      {
        id: "task-3-3",
        title: "Authentication",
        description: "Implement JWT authentication middleware.",
        expectedOutput: "Working auth system",
        order: 3,
        proofRequirements: [
          { type: "pr_link", description: "Link to your PR", required: true },
          { type: "screenshot", description: "Screenshot showing your work", required: true },
          { type: "description", description: "Brief description of what you did", required: true },
        ],
        dependencies: ["task-3-2"],
      },
    ],
  },
]

// Student Progress
export const mockStudentProgress: StudentProgress[] = [
  {
    id: "progress-1",
    studentId: "user-1",
    projectId: "template-1",
    enrolledAt: date(-14),
    tasksCompleted: ["task-1-1"],
    currentTaskId: "task-1-2",
    overallProgress: 25,
    certificateIssued: false,
  },
]

// Proof Submissions
export const mockProofSubmissions: ProofSubmission[] = [
  {
    id: "submission-1",
    taskId: "task-1-1",
    projectId: "template-1",
    studentId: "user-1",
    prLink: "https://github.com/example/repo/pull/1",
    screenshots: ["https://example.com/screenshot1.png"],
    files: [],
    description: "Set up the development environment with Python 3.9 and TensorFlow 2.13",
    status: "approved",
    submittedAt: date(-7),
    reviewedAt: date(-6),
  },
]

// Review Tasks
export const mockReviewTasks: ReviewTask[] = [
  {
    id: "review-1",
    submissionId: "submission-1",
    taskId: "task-1-2",
    taskTitle: "Data Preprocessing",
    projectId: "template-1",
    projectName: "AI/ML Image Classifier",
    studentId: "user-1",
    studentName: "Alex Student",
    reviewerId: "user-2",
    reviewerName: "Dr. Sarah Chen",
    status: "pending",
    submittedAt: date(-2),
    proofData: {
      prLink: "https://github.com/example/repo/pull/2",
      screenshots: ["https://example.com/screenshot2.png"],
      description: "Preprocessed CIFAR-10 dataset with normalization and augmentation",
    },
  },
  {
    id: "review-2",
    submissionId: "submission-2",
    taskId: "task-2-1",
    taskTitle: "Database Schema Design",
    projectId: "template-2",
    projectName: "E-commerce Frontend",
    studentId: "user-1",
    studentName: "Alex Student",
    reviewerId: "user-2",
    reviewerName: "Dr. Sarah Chen",
    status: "approved",
    submittedAt: date(-5),
    reviewedAt: date(-3),
    proofData: {
      prLink: "https://github.com/example/repo/pull/3",
      screenshots: ["https://example.com/screenshot3.png"],
      description: "Created database schema with proper indexes",
    },
  },
  {
    id: "review-3",
    submissionId: "submission-3",
    taskId: "task-1-3",
    taskTitle: "Model Training",
    projectId: "template-1",
    projectName: "AI/ML Image Classifier",
    studentId: "user-4",
    studentName: "Jordan Lee",
    reviewerId: "user-5",
    reviewerName: "Prof. Michael Ross",
    status: "changes_requested",
    submittedAt: date(-1),
    proofData: {
      prLink: "https://github.com/example/repo/pull/4",
      screenshots: ["https://example.com/screenshot4.png"],
      description: "Trained CNN model but needs hyperparameter tuning",
    },
  },
]

// Certificates
export const mockCertificates: Certificate[] = [
  {
    id: "cert-1",
    studentId: "user-1",
    studentName: "Alex Student",
    projectId: "template-2",
    projectName: "E-commerce Frontend",
    certificateNumber: "INT-2024-001",
    issuedAt: date(-30),
    issuedBy: "user-3",
    issuedByName: "Sam Admin",
    skills: ["React", "TypeScript", "Tailwind CSS"],
    tasksCompleted: 3,
    totalTasks: 3,
    mentorName: "Dr. Sarah Chen",
    reviewerName: "Prof. Michael Ross",
    completionDate: date(-30),
    platformName: "Internza",
  },
]

// Platform Stats
export const mockPlatformStats: PlatformStats = {
  totalStudents: 150,
  totalReviewers: 8,
  totalProjects: 12,
  totalCertificates: 45,
  pendingReviews: 12,
}

// Duration Options
export const mockDurationOptions: DurationOption[] = [
  {
    value: "4_weeks",
    label: "4 Weeks",
    weeks: 4,
    description: "Quick internship for focused skill building",
    popular: true,
  },
  {
    value: "8_weeks",
    label: "8 Weeks",
    weeks: 8,
    description: "Balanced internship for comprehensive learning",
    popular: true,
  },
  {
    value: "12_weeks",
    label: "12 Weeks",
    weeks: 12,
    description: "Extended internship for deep expertise",
    popular: false,
  },
  {
    value: "custom",
    label: "Custom Duration",
    weeks: 0,
    description: "Create your own internship timeline",
    popular: false,
  },
]

// Internship Plans
export const mockInternshipPlans: InternshipPlan[] = [
  {
    id: "plan-1",
    studentId: "user-1",
    durationType: "4_weeks",
    totalWeeks: 4,
    projectBlocks: [
      {
        id: "block-1",
        projectId: "template-2",
        projectTitle: "E-commerce Frontend",
        duration: 4,
        order: 1,
        status: "completed",
        enrolledAt: date(-28),
        completedAt: date(-7),
      },
    ],
    startedAt: date(-28),
    completedAt: date(-7),
    certificateUnlocked: true,
  },
  {
    id: "plan-2",
    studentId: "user-1",
    durationType: "8_weeks",
    totalWeeks: 8,
    projectBlocks: [
      {
        id: "block-2",
        projectId: "template-1",
        projectTitle: "AI Image Classifier",
        duration: 4,
        order: 1,
        status: "completed",
        enrolledAt: date(-56),
        completedAt: date(-35),
      },
      {
        id: "block-3",
        projectId: "template-3",
        projectTitle: "REST API Backend",
        duration: 4,
        order: 2,
        status: "in_progress",
        enrolledAt: date(-28),
      },
    ],
    startedAt: date(-56),
    certificateUnlocked: false,
  },
  {
    id: "plan-3",
    studentId: "user-1",
    durationType: "12_weeks",
    totalWeeks: 12,
    projectBlocks: [
      {
        id: "block-4",
        projectId: "template-4",
        projectTitle: "Mobile App Development",
        duration: 4,
        order: 1,
        status: "available",
      },
      {
        id: "block-5",
        projectId: "template-5",
        projectTitle: "Fullstack Project",
        duration: 8,
        order: 2,
        status: "locked",
      },
    ],
    certificateUnlocked: false,
  },
]

// Duration Progress
export const mockDurationProgress: DurationProgress = {
  planId: "plan-2",
  completedWeeks: 4,
  totalWeeks: 8,
  percentage: 50,
  currentBlock: {
    id: "block-3",
    projectId: "template-3",
    projectTitle: "REST API Backend",
    duration: 4,
    order: 2,
    status: "in_progress",
    enrolledAt: date(-28),
  },
  nextBlock: undefined,
  canUnlockCertificate: false,
  sequentialCompletion: true,
}

// Project Catalog
export const mockProjectCatalog: ProjectCatalogItem[] = [
  {
    id: "catalog-1",
    projectId: "template-1",
    title: "AI Image Classifier",
    shortOutcome: "Build a machine learning model that classifies images",
    duration: 4,
    skills: ["Python", "TensorFlow", "Machine Learning"],
    difficulty: "Intermediate",
    prerequisites: ["Basic Python", "ML Fundamentals"],
    deliverablesPreview: ["Trained model", "Classification report", "Demo notebook"],
    isAvailableForPlan: true,
  },
  {
    id: "catalog-2",
    projectId: "template-2",
    title: "E-commerce Frontend",
    shortOutcome: "Create a modern e-commerce website with React",
    duration: 4,
    skills: ["React", "TypeScript", "Tailwind CSS"],
    difficulty: "Beginner",
    prerequisites: ["HTML/CSS", "JavaScript basics"],
    deliverablesPreview: ["Product listing", "Shopping cart", "Checkout flow"],
    isAvailableForPlan: true,
  },
  {
    id: "catalog-3",
    projectId: "template-3",
    title: "REST API Backend",
    shortOutcome: "Build a scalable REST API with Node.js",
    duration: 4,
    skills: ["Node.js", "Express", "PostgreSQL"],
    difficulty: "Intermediate",
    prerequisites: ["JavaScript", "Database basics"],
    deliverablesPreview: ["API endpoints", "Authentication", "Documentation"],
    isAvailableForPlan: true,
  },
  {
    id: "catalog-4",
    projectId: "template-4",
    title: "Mobile App Development",
    shortOutcome: "Build a cross-platform mobile app with React Native",
    duration: 8,
    skills: ["React Native", "Mobile UI", "State Management"],
    difficulty: "Advanced",
    prerequisites: ["React", "JavaScript"],
    deliverablesPreview: ["iOS app", "Android app", "App store submission"],
    isAvailableForPlan: true,
  },
  {
    id: "catalog-5",
    projectId: "template-5",
    title: "Fullstack Project",
    shortOutcome: "Complete fullstack application with database",
    duration: 8,
    skills: ["React", "Node.js", "PostgreSQL", "Docker"],
    difficulty: "Advanced",
    prerequisites: ["Frontend basics", "Backend basics"],
    deliverablesPreview: ["Frontend app", "Backend API", "Deployment"],
    isAvailableForPlan: true,
  },
  {
    id: "catalog-6",
    projectId: "template-6",
    title: "Data Pipeline",
    shortOutcome: "Build a real-time data processing pipeline",
    duration: 12,
    skills: ["Python", "Apache Kafka", "Data Engineering"],
    difficulty: "Advanced",
    prerequisites: ["Python", "SQL", "Data concepts"],
    deliverablesPreview: ["Pipeline architecture", "Data processing", "Monitoring"],
    isAvailableForPlan: true,
  },
]

// Export all mock data
export const mockData = {
  users: mockUsers,
  projectTemplates: mockProjectTemplates,
  studentProgress: mockStudentProgress,
  proofSubmissions: mockProofSubmissions,
  reviewTasks: mockReviewTasks,
  certificates: mockCertificates,
  stats: mockPlatformStats,
  durationOptions: mockDurationOptions,
  internshipPlans: mockInternshipPlans,
  durationProgress: mockDurationProgress,
  projectCatalog: mockProjectCatalog,
}

export default mockData
