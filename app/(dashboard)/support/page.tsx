"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  MessageCircle, 
  FileText, 
  Video,
  Mail,
  ArrowRight,
  Clock,
  HelpCircle
} from "lucide-react"
import { useState } from "react"

const faqs = [
  {
    question: "How do I submit proof for a milestone?",
    answer: "Navigate to the milestone page and click 'Submit Proof'. You can upload code, documents, images, or videos that demonstrate your work.",
    category: "Getting Started",
  },
  {
    question: "What happens after I submit my proof?",
    answer: "Industry mentors will review your submission within 24-48 hours. You'll receive feedback and either approval or requests for changes.",
    category: "Review Process",
  },
  {
    question: "Can I edit my submission after uploading?",
    answer: "Yes, you can edit your submission while it's in 'pending' status. Once review begins, you'll need to wait for feedback.",
    category: "Submissions",
  },
  {
    question: "How is my verification score calculated?",
    answer: "Your score is based on completed milestones, proof quality, review ratings, and consistency of submissions.",
    category: "Verification",
  },
  {
    question: "What file types are supported?",
    answer: "We support code files (.zip, .tar), documents (.pdf, .doc), images (.png, .jpg), and videos (.mp4, .mov) up to 50MB each.",
    category: "Technical",
  },
]

const resources = [
  { title: "Getting Started Guide", type: "doc", icon: FileText },
  { title: "Video Tutorials", type: "video", icon: Video },
  { title: "Community Forum", type: "link", icon: MessageCircle },
  { title: "Contact Support", type: "email", icon: Mail },
]

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0)

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-primary">Help & Support</h1>
        <p className="text-secondary-500 mt-1">Find answers or get in touch with our team.</p>
      </div>

      {/* Search */}
      <div className="relative max-w-lg mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
        <Input
          type="text"
          placeholder="Search for help..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-11"
        />
      </div>

      {/* Resources Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {resources.map((resource) => {
          const Icon = resource.icon
          return (
            <Card key={resource.title} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-secondary-900 text-sm">{resource.title}</p>
                  <p className="text-xs text-secondary-500 capitalize">{resource.type}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* FAQs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 pt-0">
          <div className="space-y-3">
            {filteredFaqs.map((faq, index) => (
              <div 
                key={index} 
                className="border border-secondary-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="text-xs shrink-0">{faq.category}</Badge>
                    <span className="font-medium text-secondary-900">{faq.question}</span>
                  </div>
                  <ArrowRight className={`h-4 w-4 text-secondary-400 transition-transform ${expandedFaq === index ? "rotate-90" : ""}`} />
                </button>
                {expandedFaq === index && (
                  <div className="px-4 pb-4 pt-0">
                    <p className="text-secondary-600 text-sm pl-[calc(0.75rem+4.5rem)]">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {filteredFaqs.length === 0 && (
            <div className="text-center py-8">
              <p className="text-secondary-500">No results found for &quot;{searchQuery}&quot;</p>
              <p className="text-sm text-secondary-400 mt-1">Try a different search term or contact support.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact Section */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <MessageCircle className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900">Live Chat</h3>
                <p className="text-sm text-secondary-500 mt-1">Available Mon-Fri, 9AM-6PM IST</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="h-2 w-2 rounded-full bg-accent" />
                  <span className="text-xs text-secondary-600">Typically replies in 5 minutes</span>
                </div>
                <Button size="sm" className="mt-3 gap-1">
                  Start Chat <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900">Email Support</h3>
                <p className="text-sm text-secondary-500 mt-1">Get help via email</p>
                <div className="flex items-center gap-2 mt-2">
                  <Clock className="h-3 w-3 text-secondary-400" />
                  <span className="text-xs text-secondary-600">Response within 24 hours</span>
                </div>
                <Button variant="outline" size="sm" className="mt-3 gap-1">
                  Send Email <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
