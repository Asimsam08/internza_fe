"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { mockPlatformStats, mockUsers, mockProjectTemplates, mockReviewTasks } from "@/lib/mockData"
import { 
  Users, 
  GraduationCap,
  Briefcase,
  CheckCircle,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  ArrowUpRight
} from "lucide-react"

export default function AdminDashboardPage() {
  const stats = mockPlatformStats

  // Core metrics
  const coreMetrics = {
    activeUsers: mockUsers.filter(u => u.status === 'active').length,
    completedProjects: mockProjectTemplates.filter(p => p.status === 'published').length,
    pendingReviews: mockReviewTasks.filter(r => r.status === 'pending').length,
    avgCompletionTime: 18.4,
    monthlyGrowth: 12.3,
    userSatisfaction: 94.2
  }

  // Enhanced weekly activity data for better visualization
  const weeklyData = [
    { day: 'Mon', submissions: 45, reviews: 38, users: 12 },
    { day: 'Tue', submissions: 52, reviews: 42, users: 18 },
    { day: 'Wed', submissions: 38, reviews: 35, users: 15 },
    { day: 'Thu', submissions: 48, reviews: 40, users: 20 },
    { day: 'Fri', submissions: 55, reviews: 48, users: 22 },
    { day: 'Sat', submissions: 42, reviews: 36, users: 8 },
    { day: 'Sun', submissions: 38, reviews: 32, users: 6 }
  ]

  // Project distribution data
  const projectDistribution = [
    { category: 'Software Engineering', value: 35, count: 156 },
    { category: 'Data Science', value: 25, count: 112 },
    { category: 'UI/UX Design', value: 20, count: 89 },
    { category: 'Product Management', value: 12, count: 54 },
    { category: 'Marketing', value: 8, count: 36 }
  ]

  // User growth data
  const userGrowth = [
    { month: 'Jan', students: 892, reviewers: 45 },
    { month: 'Feb', students: 1024, reviewers: 52 },
    { month: 'Mar', students: 1156, reviewers: 58 },
    { month: 'Apr', students: 1289, reviewers: 64 },
    { month: 'May', students: 1423, reviewers: 71 },
    { month: 'Jun', students: 1567, reviewers: 78 }
  ]

  // Review efficiency data
  const reviewEfficiency = [
    { week: 'W1', completed: 142, pending: 23, efficiency: 86 },
    { week: 'W2', completed: 168, pending: 19, efficiency: 90 },
    { week: 'W3', completed: 155, pending: 28, efficiency: 85 },
    { week: 'W4', completed: 189, pending: 15, efficiency: 93 }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Analytics Dashboard</h1>
            <p className="text-slate-600 mt-1">Real-time platform performance and insights</p>
          </div>
        </div>

        {/* Core KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                  <GraduationCap className="h-7 w-7 text-white" />
                </div>
                <div className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <ArrowUpRight className="h-4 w-4" />
                  <span>+{coreMetrics.monthlyGrowth}%</span>
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900">{stats.totalStudents.toLocaleString()}</p>
                <p className="text-sm text-slate-600 font-medium mt-1">Total Students</p>
                <p className="text-xs text-slate-500 mt-2">{coreMetrics.activeUsers} active this month</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                  <Users className="h-7 w-7 text-white" />
                </div>
                <div className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <ArrowUpRight className="h-4 w-4" />
                  <span>+8.7%</span>
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900">{stats.totalReviewers}</p>
                <p className="text-sm text-slate-600 font-medium mt-1">Expert Reviewers</p>
                <p className="text-xs text-slate-500 mt-2">92.1% efficiency rate</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg">
                  <Briefcase className="h-7 w-7 text-white" />
                </div>
                <div className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <ArrowUpRight className="h-4 w-4" />
                  <span>+15.2%</span>
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900">{stats.totalProjects}</p>
                <p className="text-sm text-slate-600 font-medium mt-1">Active Projects</p>
                <p className="text-xs text-slate-500 mt-2">{coreMetrics.completedProjects} completed</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg">
                  <CheckCircle className="h-7 w-7 text-white" />
                </div>
                <div className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <ArrowUpRight className="h-4 w-4" />
                  <span>+5.4%</span>
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900">{coreMetrics.userSatisfaction}%</p>
                <p className="text-sm text-slate-600 font-medium mt-1">Satisfaction Score</p>
                <p className="text-xs text-slate-500 mt-2">{coreMetrics.avgCompletionTime}d avg completion</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Professional Graphs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weekly Activity Chart */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                  <BarChart3 className="h-4 w-4 text-white" />
                </div>
                Weekly Activity Trends
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Submissions Bar Chart */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-blue-600">Submissions</span>
                    <span className="text-slate-500">Peak: Friday</span>
                  </div>
                  <div className="relative h-32">
                    {weeklyData.map((day, index) => (
                      <div
                        key={index}
                        className="absolute bottom-0 flex flex-col items-center"
                        style={{ left: `${(index / 6) * 100}%`, transform: 'translateX(-50%)' }}
                      >
                        <div
                          className="w-8 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-md transition-all duration-300 hover:from-blue-600 hover:to-blue-500"
                          style={{ height: `${(day.submissions / 55) * 100}%` }}
                        ></div>
                        <span className="text-xs text-slate-600 mt-1">{day.day}</span>
                        <span className="text-xs font-medium text-blue-600">{day.submissions}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reviews Line Chart */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-green-600">Reviews</span>
                    <span className="text-slate-500">Avg: 39/day</span>
                  </div>
                  <div className="relative h-20">
                    <svg className="w-full h-full" viewBox="0 0 280 80">
                      <polyline
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="2"
                        points={weeklyData.map((day, index) => `${(index / 6) * 280},${80 - (day.reviews / 48) * 60}`).join(' ')}
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#34d399" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-end justify-between px-2">
                      {weeklyData.map((day, index) => (
                        <div key={index} className="flex flex-col items-center" style={{ marginLeft: index === 0 ? '0' : index === 6 ? '0' : 'auto', marginRight: index === 0 ? 'auto' : index === 6 ? '0' : 'auto' }}>
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs text-green-600 mt-1">{day.reviews}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Distribution */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600">
                  <PieChart className="h-4 w-4 text-white" />
                </div>
                Project Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Donut Chart Representation */}
                <div className="relative h-48 flex items-center justify-center">
                  <div className="relative w-40 h-40">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                      {projectDistribution.map((segment, index) => {
                        const circumference = 2 * Math.PI * 70
                        const strokeDasharray = circumference
                        const strokeDashoffset = circumference - (segment.value / 100) * circumference
                        const previousSegments = projectDistribution.slice(0, index).reduce((acc, seg) => acc + seg.value, 0)
                        const rotation = (previousSegments / 100) * 360
                        
                        return (
                          <circle
                            key={index}
                            cx="80"
                            cy="80"
                            r="70"
                            fill="none"
                            stroke={index === 0 ? '#3b82f6' : index === 1 ? '#10b981' : index === 2 ? '#f59e0b' : index === 3 ? '#8b5cf6' : '#ec4899'}
                            strokeWidth="20"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                            transform={`rotate(${rotation} 80 80)`}
                            className="transition-all duration-300 hover:opacity-80"
                          />
                        )
                      })}
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-slate-900">{stats.totalProjects}</p>
                        <p className="text-xs text-slate-600">Total Projects</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Legend */}
                <div className="grid grid-cols-2 gap-3">
                  {projectDistribution.map((segment, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-green-500' : index === 2 ? 'bg-amber-500' : index === 3 ? 'bg-purple-500' : 'bg-pink-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-slate-700">{segment.category}</p>
                        <p className="text-xs text-slate-500">{segment.count} projects</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Growth and Review Efficiency */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Growth Chart */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-600">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                User Growth Trends
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                {userGrowth.map((month, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">{month.month}</span>
                      <div className="flex gap-4">
                        <span className="text-blue-600">{month.students} students</span>
                        <span className="text-purple-600">{month.reviewers} reviewers</span>
                      </div>
                    </div>
                    <div className="flex gap-2 h-6">
                      <div className="flex-1 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500"
                          style={{ width: `${(month.students / 1567) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex-1 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all duration-500"
                          style={{ width: `${(month.reviewers / 78) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex gap-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-xs text-slate-600">Students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-xs text-slate-600">Reviewers</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Review Efficiency */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-600">
                  <Activity className="h-4 w-4 text-white" />
                </div>
                Review Efficiency
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {reviewEfficiency.map((week, index) => (
                  <div key={index} className="p-4 rounded-lg border border-slate-200 bg-slate-50/50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-slate-900">{week.week}</span>
                      <div className="flex items-center gap-2">
                        <div className={`px-2 py-1 rounded-md text-xs font-semibold ${
                          week.efficiency >= 90 ? 'bg-emerald-100 text-emerald-700' :
                          week.efficiency >= 85 ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {week.efficiency}% efficiency
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Completed</span>
                        <span className="font-medium text-emerald-600">{week.completed}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Pending</span>
                        <span className="font-medium text-amber-600">{week.pending}</span>
                      </div>
                      <div className="mt-2">
                        <Progress value={week.efficiency} className="h-2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
