"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Zap, ArrowRight } from "lucide-react"

const milestones = [
  {
    id: 1,
    title: "Architecture & Infrastructure",
    duration: "3 Days",
    priority: "High",
    status: "completed",
    tasks: [
      { title: "Setup Next.js project", description: "Initialize with Tailwind, TypeScript, and database schema.", completed: true },
      { title: "Database Schema", description: "Design Prisma schema for chat history and user sessions.", completed: true },
    ],
  },
  {
    id: 2,
    title: "LLM Integration & RAG",
    duration: "7 Days",
    priority: "Critical",
    status: "in_progress",
    tasks: [
      { title: "Integrate OpenAI API", description: "Setup streaming responses using the Vercel AI SDK.", completed: true },
      { title: "Vector Store Setup", description: "Configure Pinecone or Supabase Vector for context retrieval.", completed: false },
    ],
  },
  {
    id: 3,
    title: "Frontend Experience",
    duration: "5 Days",
    priority: "Medium",
    status: "locked",
    tasks: [
      { title: "Build the Chat UI", description: "Build with user interface with markdown support.", completed: false },
      { title: "Adaptive Theming", description: "Implement dark/light mode and customize AI personas.", completed: false },
    ],
  },
  {
    id: 4,
    title: "Deployment & Scaling",
    duration: "3 Days",
    priority: "Low",
    status: "locked",
    tasks: [
      { title: "CI/CD Pipeline", description: "Automated testing and deployment with GitHub Actions.", completed: false },
      { title: "Edge Functions", description: "Optimize LLM inference with latency using Vercel Edge.", completed: false },
    ],
  },
]

const aiReasoning = {
  description: "This path is optimized for 'Deep Competency' (we pre-trained milestone 3 first) because vector retrieval retrieves in 83% of successful chatbot projects.",
  recommendations: [
    "Best vector API: trending (OpenAI/x.Antropic)",
    "Server-less RAG: best logic for scaleability",
    "Vector database architectural design",
  ],
  marketReadiness: "EXCELLENT",
}

export default function InternshipDetailPage() {
  return (
    <div className="mx-auto max-w-6xl">
      {/* Info Banner */}
      <Card className="mb-6 border-0 shadow-lg bg-gradient-to-r from-primary/5 via-primary/[0.02] to-accent/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 flex-shrink-0">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-primary mb-2">Project Preview</h3>
              <p className="text-sm text-secondary-600 mb-3">
                This is a project preview for exploration. To start an internship, go to the{" "}
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
      </Card>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-secondary-500">
          <span className="text-accent-600">AI-GENERATED INTERNSHIP ROADMAP</span>
        </div>
        <h1 className="mt-2 text-3xl font-bold text-primary">Fullstack AI Chatbot</h1>
        <p className="mt-2 text-secondary-600">
          Build a production-ready RAG-based chatbot using Next.js, OpenAI, and Vector Databases.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content - Roadmap */}
        <div className="lg:col-span-2 space-y-6">
          {milestones.map((milestone, index) => (
            <Card key={milestone.id} className={`${milestone.status === "locked" ? "opacity-75" : ""}`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Milestone Number */}
                  <div className={`
                    flex h-10 w-10 shrink-0 items-center justify-center rounded-lg
                    ${milestone.status === "completed" ? "bg-primary-900 text-white" : ""}
                    ${milestone.status === "in_progress" ? "bg-primary-900 text-white" : ""}
                    ${milestone.status === "locked" ? "bg-secondary-100 text-secondary-400" : ""}
                  `}>
                    {milestone.status === "completed" ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : milestone.status === "in_progress" ? (
                      <Zap className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-semibold">{index + 1}</span>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-semibold ${milestone.status === "locked" ? "text-secondary-500" : "text-primary"}`}>
                        {milestone.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-secondary-500">Estimated: {milestone.duration}</span>
                        <span className="text-xs text-secondary-500">Priority: {milestone.priority}</span>
                        <Badge variant={milestone.status === "completed" ? "success" : milestone.status === "in_progress" ? "info" : "secondary"} className="text-xs">
                          {milestone.status === "in_progress" ? "UPCOMING" : milestone.status === "locked" ? "LOCKED" : "COMPLETED"}
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      {milestone.tasks.map((task, taskIndex) => (
                        <div key={taskIndex} className={`flex items-start gap-3 rounded-lg border p-3 ${task.completed ? "border-emerald-200 bg-emerald-50/50" : "border-secondary-200 bg-neutral-100/50"}`}>
                          <div className={`
                            flex h-5 w-5 shrink-0 items-center justify-center rounded
                            ${task.completed ? "bg-emerald-500 text-white" : "border-2 border-secondary-300"}
                          `}>
                            {task.completed && <CheckCircle className="h-3.5 w-3.5" />}
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${task.completed ? "text-emerald-800" : "text-secondary-700"}`}>
                              {task.title}
                            </p>
                            <p className={`text-xs ${task.completed ? "text-accent" : "text-secondary-500"}`}>
                              {task.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Submit Proof Button */}
          <Button className="w-full" size="lg">
            + Submit Proof
          </Button>

          {/* Footer Links */}
          <div className="flex justify-between text-sm text-secondary-500">
            <button className="flex items-center gap-1 hover:text-secondary-700">
              <span>Support</span>
            </button>
            <button className="flex items-center gap-1 hover:text-secondary-700">
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Sidebar - AI Reasoning & Progress */}
        <div className="space-y-6">
          {/* Progress Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-500">Overall Progress</span>
                <span className="text-2xl font-bold text-primary">0%</span>
              </div>
              <Progress value={0} className="mt-3" />
              <Button
                className="mt-4 w-full"
                size="sm"
                onClick={() => window.location.href = "/internship"}
              >
                Add to Internship Plan →
              </Button>
            </CardContent>
          </Card>

          {/* AI Reasoning Card */}
          <Card className="bg-primary-900 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-accent-400" />
                <span className="font-semibold">AI Reasoning</span>
              </div>
              <p className="mt-3 text-sm text-primary-200">
                {aiReasoning.description}
              </p>
              
              <div className="mt-4 space-y-2">
                <p className="text-xs uppercase tracking-wider text-primary-300">Key Recommendations</p>
                {aiReasoning.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" />
                    <span className="text-sm text-primary-100">{rec}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-white/10 pt-4">
                <p className="text-xs text-primary-300">Market Readiness Score</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-lg font-semibold">{aiReasoning.marketReadiness}</span>
                  <div className="h-2 w-24 rounded-full bg-white/20">
                    <div className="h-full w-[95%] rounded-full bg-emerald-400" />
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-white/10 pt-4">
                <p className="text-xs text-primary-300">Mentor AI Advice</p>
                <p className="mt-2 text-xs text-primary-200">
                  &ldquo;Focus on the streaming implementation in milestone 2; users love seeing AI think in real-time. The RAG pattern chosen here is the best for scale.&rdquo;
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop"
                    alt="Mentor"
                    className="h-6 w-6 rounded-full"
                  />
                  <span className="text-xs text-primary-300">ASSIGNED AI MENTOR: SOCRATES-4</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
