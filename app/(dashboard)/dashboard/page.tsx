"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAuthStore } from "@/stores/authStore"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Briefcase,
  Flag,
  Upload,
  Award,
  Clock,
  CheckCircle,
  ArrowRight,
  PlayCircle,
  AlertCircle,
  ChevronRight,
  Sparkles,
  Calendar,
  Target
} from "lucide-react"
import { useEffect, useState } from "react"

interface InternshipPlan {
  id: string
  studentId: string
  durationType: string
  totalWeeks: number
  startedAt?: string
  completedAt?: string
  projectBlocks: any[]
}

export default function DashboardPage() {
  const { user } = useAuthStore()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [activeInternship, setActiveInternship] = useState<InternshipPlan | null>(null)

  // Extract user name
  const userName = user?.studentProfile 
    ? `${user.studentProfile.firstName} ${user.studentProfile.lastName}`.trim()
    : user?.name || "Student"

  useEffect(() => {
    // TODO: Fetch active internship from API
    // For now, simulate no active internship for first-time user
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-secondary-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  // First-time user - no active internship
  if (!activeInternship) {
    return (
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary via-primary to-accent rounded-2xl p-8 text-white">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-6 w-6" />
            <span className="text-sm font-medium opacity-90">Welcome to Internza</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Hello, {userName}! 👋
          </h1>
          <p className="text-lg opacity-90 mb-6">
            You don't have any active internship yet. Start your journey by choosing an internship plan.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90"
            onClick={() => router.push('/internship')}
          >
            <PlayCircle className="mr-2 h-5 w-5" />
            Choose Internship Plan
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Getting Started Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-2 hover:border-primary transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Choose Duration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-secondary-600 mb-4">
                Select from 4, 8, or 12-week internship plans based on your schedule.
              </p>
              <Button variant="outline" className="w-full" onClick={() => router.push('/internship')}>
                Get Started
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Select Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-secondary-600 mb-4">
                Browse and choose from our curated project templates across different domains.
              </p>
              <Button variant="outline" className="w-full" onClick={() => router.push('/projects')}>
                Explore Projects
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Earn Certificate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-secondary-600 mb-4">
                Complete tasks, submit proofs, and get verified by industry experts.
              </p>
              <Button variant="outline" className="w-full" onClick={() => router.push('/verification')}>
                Learn More
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // User with active internship - show details
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">
            Welcome back, {userName}!
          </h1>
          <p className="text-secondary-600">
            Continue your internship journey
          </p>
        </div>
        <Badge variant="outline" className="text-primary border-primary">
          {activeInternship.durationType.replace('_', ' ')} Plan
        </Badge>
      </div>

      {/* Active Internship Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Active Internship</span>
            <Badge className="bg-green-100 text-green-800">
              In Progress
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Calendar className="h-5 w-5 text-secondary-400" />
              <div>
                <p className="text-sm font-medium text-secondary-900">
                  Started on {activeInternship.startedAt ? new Date(activeInternship.startedAt).toLocaleDateString() : 'N/A'}
                </p>
                <p className="text-sm text-secondary-600">
                  {activeInternship.totalWeeks} weeks total
                </p>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-secondary-600">0%</span>
              </div>
              <Progress value={0} className="h-2" />
            </div>

            <div className="flex gap-3">
              <Button className="flex-1">
                <PlayCircle className="mr-2 h-4 w-4" />
                Continue Learning
              </Button>
              <Button variant="outline">
                View Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
