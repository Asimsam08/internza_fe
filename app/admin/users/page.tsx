"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Search,
  UserPlus,
  MoreHorizontal,
  GraduationCap,
  Users,
  Shield
} from "lucide-react"
import { UserRole } from "@/lib/types"
import { useUsers, useCreateReviewer, User } from "@/lib/hooks/use-admin"
import { toast } from "sonner"

const roleColors = {
  student: "bg-blue-100 text-blue-800",
  reviewer: "bg-purple-100 text-purple-800", 
  super_admin: "bg-amber-100 text-amber-800",
}

const roleIcons = {
  student: <GraduationCap className="h-3 w-3" />,
  reviewer: <Users className="h-3 w-3" />,
  super_admin: <Shield className="h-3 w-3" />,
}

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all")
  const [isAddReviewerOpen, setIsAddReviewerOpen] = useState(false)
  const [newReviewerEmail, setNewReviewerEmail] = useState("")
  const [newReviewerName, setNewReviewerName] = useState("")
  const [generatedPassword, setGeneratedPassword] = useState("")
  const [showCredentials, setShowCredentials] = useState(false)

  const { data: users = [], isLoading, error } = useUsers()
  const createReviewer = useCreateReviewer()

  const filteredUsers = useMemo(() => {
    return users.filter((user: User) => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      const normalizedUserRole = user.role.toLowerCase()
      const matchesRole = roleFilter === "all" || normalizedUserRole === roleFilter
      return matchesSearch && matchesRole
    })
  }, [users, searchQuery, roleFilter])

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
    let password = ''
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
  }

  const generatePasswordForForm = () => {
    if (newReviewerEmail && newReviewerName) {
      const password = generateRandomPassword()
      setGeneratedPassword(password)
    }
  }

  const handleAddReviewer = async () => {
    if (!newReviewerEmail || !newReviewerName || !generatedPassword) {
      toast.error("Please fill in all fields")
      return
    }

    try {
      await createReviewer.mutateAsync({
        fullName: newReviewerName,
        email: newReviewerEmail,
        password: generatedPassword,
      })

      setShowCredentials(true)
      toast.success("Reviewer account created successfully!")
    } catch (error: any) {
      console.error("Failed to create reviewer:", error)
      toast.error(error.message || "Failed to create reviewer account")
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-primary">User Management</h1>
        <p className="text-sm text-secondary-600">Manage platform users and their roles</p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 text-red-600">
          Failed to load users. Please try again.
        </div>
      )}

      {/* User Statistics */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <GraduationCap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-900">{users.filter((u: User) => u.role.toLowerCase() === 'student').length}</p>
              <p className="text-sm text-slate-600">Students</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-900">{users.filter((u: User) => u.role.toLowerCase() === 'reviewer').length}</p>
              <p className="text-sm text-slate-600">Reviewers</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <Shield className="h-8 w-8 text-amber-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-900">{users.filter((u: User) => u.role.toLowerCase() === 'super_admin').length}</p>
              <p className="text-sm text-slate-600">Admins</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-900">{users.length}</p>
              <p className="text-sm text-slate-600">Total Users</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* User Management */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>All Users</CardTitle>
              <CardDescription>Search and filter platform users</CardDescription>
            </div>
            <Dialog open={isAddReviewerOpen} onOpenChange={setIsAddReviewerOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add Reviewer
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Reviewer</DialogTitle>
                  <DialogDescription>
                    Create a new reviewer account. They will use these credentials to login through the regular sign-in page.
                  </DialogDescription>
                </DialogHeader>
                
                {!showCredentials ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                      <Input
                        id="name"
                        placeholder="Enter reviewer's full name"
                        value={newReviewerName}
                        onChange={(e) => {
                          setNewReviewerName(e.target.value)
                          generatePasswordForForm()
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">Email Address</label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter reviewer's email"
                        value={newReviewerEmail}
                        onChange={(e) => {
                          setNewReviewerEmail(e.target.value)
                          generatePasswordForForm()
                        }}
                      />
                    </div>
                    {newReviewerEmail && newReviewerName && generatedPassword && (
                      <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium">Generated Password</label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="password"
                            value={generatedPassword}
                            readOnly
                            className="font-mono bg-secondary-50"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(generatedPassword)}
                          >
                            Copy
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const password = generateRandomPassword()
                              setGeneratedPassword(password)
                            }}
                          >
                            Regenerate
                          </Button>
                        </div>
                        <p className="text-xs text-secondary-500">
                          Password will be sent to backend when you create the reviewer account
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-2">Reviewer Account Created!</h4>
                      <p className="text-sm text-green-700 mb-3">
                        Share these credentials with the reviewer. They can login using the regular sign-in page.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-white border rounded">
                          <div>
                            <p className="text-xs text-secondary-500">Email</p>
                            <p className="font-medium">{newReviewerEmail}</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(newReviewerEmail)}
                          >
                            Copy
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white border rounded">
                          <div>
                            <p className="text-xs text-secondary-500">Password</p>
                            <p className="font-mono text-sm">{generatedPassword}</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(generatedPassword)}
                          >
                            Copy
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <DialogFooter>
                  {!showCredentials ? (
                    <>
                      <Button variant="outline" onClick={() => setIsAddReviewerOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddReviewer}
                        disabled={!newReviewerEmail || !newReviewerName || !generatedPassword || createReviewer.isPending}
                        isLoading={createReviewer.isPending}
                      >
                        Submit Reviewer
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" onClick={() => {
                        setShowCredentials(false)
                        setNewReviewerEmail('')
                        setNewReviewerName('')
                        setGeneratedPassword('')
                      }}>
                        Add Another
                      </Button>
                      <Button onClick={() => setIsAddReviewerOpen(false)}>
                        Done
                      </Button>
                    </>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
              <Input
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              {["all", "student", "reviewer", "super_admin"].map((role) => (
                <Button
                  key={role}
                  variant={roleFilter === role ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setRoleFilter(role as UserRole | "all")}
                >
                  {role === "super_admin" ? "Admin" : role.charAt(0).toUpperCase() + role.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!isLoading && !error && (
            <div className="space-y-2">
              {filteredUsers.map((user) => (
              <div 
                key={user.id} 
                className="flex items-center justify-between p-4 hover:bg-secondary-50 rounded-lg transition-colors border border-secondary-100"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-medium text-primary">{user.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-secondary-900">{user.name}</p>
                    <p className="text-sm text-secondary-500">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`${roleColors[user.role.toLowerCase() as keyof typeof roleColors]} border-0 text-xs`}>
                        <span className="flex items-center gap-1">
                          {roleIcons[user.role.toLowerCase() as keyof typeof roleIcons]}
                          {user.role.toLowerCase() === "super_admin" ? "Admin" : user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()}
                        </span>
                      </Badge>
                      <span className="text-xs text-secondary-500">Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
