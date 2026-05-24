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
  Shield,
  Mail,
} from "lucide-react"
import { UserRole } from "@/lib/types"
import { useUsers, useInviteReviewer, type InviteReviewerResult, User } from "@/lib/hooks/use-admin"
import { MagicLinkFallbackPanel } from "@/components/shared/MagicLinkFallbackPanel"
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
  const [lastInvite, setLastInvite] = useState<InviteReviewerResult | null>(null)

  const { data: users = [], isLoading, error } = useUsers()
  const inviteReviewer = useInviteReviewer()

  const filteredUsers = useMemo(() => {
    return users.filter((user: User) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      const normalizedUserRole = user.role.toLowerCase()
      const matchesRole = roleFilter === "all" || normalizedUserRole === roleFilter
      return matchesSearch && matchesRole
    })
  }, [users, searchQuery, roleFilter])

  const handleInviteReviewer = async () => {
    if (!newReviewerEmail || !newReviewerName) {
      toast.error("Please fill in name and email")
      return
    }

    try {
      const result = await inviteReviewer.mutateAsync({
        fullName: newReviewerName,
        email: newReviewerEmail,
      })
      setLastInvite(result)
      setNewReviewerEmail("")
      setNewReviewerName("")
    } catch {
      // toast handled in hook
    }
  }

  const closeInviteDialog = () => {
    setIsAddReviewerOpen(false)
    setLastInvite(null)
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-primary">User Management</h1>
        <p className="text-sm text-secondary-600">Manage platform users and their roles</p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 text-red-600">
          Failed to load users. Please try again.
        </div>
      )}

      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <GraduationCap className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-900">
                {users.filter((u: User) => u.role.toLowerCase() === "student").length}
              </p>
              <p className="text-sm text-slate-600">Students</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-900">
                {users.filter((u: User) => u.role.toLowerCase() === "reviewer").length}
              </p>
              <p className="text-sm text-slate-600">Reviewers</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <Shield className="h-8 w-8 text-amber-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-900">
                {users.filter((u: User) => u.role.toLowerCase() === "super_admin").length}
              </p>
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

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>All Users</CardTitle>
              <CardDescription>Search and filter platform users</CardDescription>
            </div>
            <Dialog
              open={isAddReviewerOpen}
              onOpenChange={(open) => {
                if (!open) closeInviteDialog()
                else setIsAddReviewerOpen(true)
              }}
            >
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Invite Reviewer
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {lastInvite ? "Invite created" : "Invite global reviewer"}
                  </DialogTitle>
                  <DialogDescription>
                    {lastInvite
                      ? "Share the link below if the reviewer did not receive email."
                      : "We email a secure setup link. You can always copy the link from the next screen."}
                  </DialogDescription>
                </DialogHeader>

                {lastInvite?.inviteUrl ? (
                  <MagicLinkFallbackPanel
                    title="Reviewer invite link"
                    items={[
                      {
                        email: lastInvite.email,
                        name: lastInvite.fullName,
                        inviteUrl: lastInvite.inviteUrl,
                        emailSent: lastInvite.inviteSent,
                        roleLabel: "Global reviewer",
                      },
                    ]}
                    autoExpandOnFailure
                  />
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Full name
                      </label>
                      <Input
                        id="name"
                        placeholder="Jane Smith"
                        value={newReviewerName}
                        onChange={(e) => setNewReviewerName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="reviewer@example.com"
                        value={newReviewerEmail}
                        onChange={(e) => setNewReviewerEmail(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <DialogFooter>
                  {lastInvite ? (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setLastInvite(null)
                        }}
                      >
                        Invite another
                      </Button>
                      <Button onClick={closeInviteDialog}>Done</Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" onClick={closeInviteDialog}>
                        Cancel
                      </Button>
                      <Button
                        onClick={handleInviteReviewer}
                        disabled={!newReviewerEmail || !newReviewerName || inviteReviewer.isPending}
                        isLoading={inviteReviewer.isPending}
                        className="gap-2"
                      >
                        <Mail className="h-4 w-4" />
                        Send invite
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
                        <Badge
                          className={`${roleColors[user.role.toLowerCase() as keyof typeof roleColors]} border-0 text-xs`}
                        >
                          <span className="flex items-center gap-1">
                            {roleIcons[user.role.toLowerCase() as keyof typeof roleIcons]}
                            {user.role.toLowerCase() === "super_admin"
                              ? "Admin"
                              : user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()}
                          </span>
                        </Badge>
                        <span className="text-xs text-secondary-500">
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </span>
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
