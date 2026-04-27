"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  User,
  Mail,
  Building2,
  GraduationCap,
  Save,
  Camera
} from "lucide-react"
import { useState, useEffect } from "react"
import { useUpdateProfile, useCurrentUser } from "@/lib/hooks/use-auth"
import { toast } from "sonner"

export default function SettingsPage() {
  const { data: user } = useCurrentUser()
  const updateProfile = useUpdateProfile()
  const [mounted, setMounted] = useState(false)

  // Initialize form data with user data from API
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    university: "",
    gradYear: "",
    bio: "",
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  // Update form data when user data is available
  useEffect(() => {
    if (user && mounted) {
      setFormData({
        name: user?.studentProfile
          ? `${user.studentProfile.firstName} ${user.studentProfile.lastName}`.trim()
          : user?.name || "",
        email: user?.email || "",
        university: user?.studentProfile?.university || "",
        gradYear: user?.studentProfile?.gradYear?.toString() || "",
        bio: user?.studentProfile?.bio || "",
      })
    }
  }, [user, mounted])

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return null
  }

  const handleSave = async () => {
    try {
      // Split name into first and last name
      const nameParts = formData.name.trim().split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''

      await updateProfile.mutateAsync({
        firstName,
        lastName,
        university: formData.university || undefined,
        gradYear: formData.gradYear ? parseInt(formData.gradYear) : undefined,
        bio: formData.bio || undefined,
      })

      toast.success("Profile updated successfully")
    } catch (error) {
      console.error("Failed to update profile:", error)
      toast.error("Failed to update profile. Please try again.")
    }
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-primary">Settings</h1>
        <p className="text-secondary-500">Manage your account preferences and profile information.</p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile Information
          </CardTitle>
          <CardDescription>Update your personal information and how others see you on the platform.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop"
                alt="Profile"
                className="h-20 w-20 rounded-full object-cover ring-2 ring-white shadow-md"
              />
              <button className="absolute bottom-0 right-0 h-7 w-7 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary-600 transition-colors">
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>
            <div>
              <p className="font-medium text-secondary-900">Profile Photo</p>
              <p className="text-sm text-secondary-500">JPG, PNG or GIF. Max 2MB.</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
                <Input 
                  id="name" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
                <Input 
                  id="email" 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="university">University</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
                <Input 
                  id="university" 
                  value={formData.university}
                  onChange={(e) => setFormData({...formData, university: e.target.value})}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gradYear">Graduation Year</Label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
                <Input 
                  id="gradYear" 
                  value={formData.gradYear}
                  onChange={(e) => setFormData({...formData, gradYear: e.target.value})}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              rows={3}
              className="w-full rounded-lg border border-secondary-200 bg-white px-3 py-2 text-sm placeholder:text-secondary-400 focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/10 resize-none"
            />
          </div>

          <Button
            onClick={handleSave}
            isLoading={updateProfile.isPending}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Preferences - Commented out for now */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </CardTitle>
          <CardDescription>Choose what notifications you receive and how.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Milestone Reminders", desc: "Get notified when deadlines are approaching", checked: true },
            { label: "Review Updates", desc: "Receive updates when your proofs are reviewed", checked: true },
            { label: "New Internships", desc: "Be the first to know about new opportunities", checked: false },
            { label: "Weekly Digest", desc: "Get a weekly summary of your progress", checked: true },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-secondary-900">{item.label}</p>
                <p className="text-sm text-secondary-500">{item.desc}</p>
              </div>
              <label className="relative inline-flex h-6 w-11 cursor-pointer items-center">
                <input type="checkbox" defaultChecked={item.checked} className="sr-only peer" />
                <div className="peer h-6 w-11 rounded-full bg-secondary-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-primary peer-checked:after:translate-x-5" />
              </label>
            </div>
          ))}
        </CardContent>
      </Card> */}

      {/* Security - Commented out for now */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </CardTitle>
          <CardDescription>Manage your password and account security.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-secondary-900">Password</p>
              <p className="text-sm text-secondary-500">Last changed 3 months ago</p>
            </div>
            <Button variant="outline" size="sm">Change Password</Button>
          </div>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-secondary-900">Two-Factor Authentication</p>
              <p className="text-sm text-secondary-500">Add an extra layer of security</p>
            </div>
            <Badge variant="outline" className="gap-1">
              <CheckCircle className="h-3 w-3" />
              Enabled
            </Badge>
          </div>
        </CardContent>
      </Card> */}
    </div>
  )
}
