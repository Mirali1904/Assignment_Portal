"use client"

import { useState, useEffect } from "react"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Plus, FileText, Users, Clock, CheckCircle,
} from "lucide-react"
import { useToast } from "@/components/hooks/use-toast"
import Link from "next/link"
import router from "next/router"

// Initial mock (optional fallback)
const mockAssignments: any[] = []

export default function TeacherDashboard() {
  const [assignments, setAssignments] = useState(mockAssignments)
  const [userName, setUserName] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    pendingReviews: 0,
    completedReviews: 0,
    totalAssignments: 0,
    submissionCount: 0,
  });

  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    deadline: "",
    branch: "",
    year: "",
  })
  const { toast } = useToast()

  const branches = ["cse", "it", "Electronics", "Mechanical", "Civil", "Electrical"]
  const years = ["1", "2", "3", "4"]

  useEffect(() => {
    setUserName(localStorage.getItem("userName") || "Teacher")

    const fetchAssignments = async () => {
      const res = await fetch("http://localhost:5000/api/assignments")
      const data = await res.json()

      setAssignments(data.assignments)
      setStats(data.stats)
    }

    fetchAssignments()
  }, [])

  const handleCreateAssignment = async () => {
    const { title, description, deadline, branch, year } = newAssignment

    if (!title || !description || !deadline || !branch || !year) return

    try {
      const res = await fetch("http://localhost:5000/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAssignment),
      })

      const data = await res.json()

      if (res.ok) {
        setAssignments(prev => [...prev, data.assignment])
        toast({
          title: "Assignment created",
          description: "Your assignment has been posted successfully.",
        })
        setNewAssignment({ title: "", description: "", deadline: "", branch: "", year: "" })
        setIsCreateDialogOpen(false)
      } else {
        toast({
          title: "Error",
          description: data.message,
          variant: "destructive",
        })
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Server error. Please try again later.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {userName}!</h1>
          <p className="text-gray-600">Manage your assignments and track student progress.</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Assignment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Assignment</DialogTitle>
              <DialogDescription>Add a new assignment for your students.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newAssignment.title}
                  onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
                  placeholder="Assignment title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newAssignment.description}
                  onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
                  placeholder="Assignment description"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={newAssignment.deadline}
                  onChange={(e) => setNewAssignment({ ...newAssignment, deadline: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Branch</Label>
                <Select
                  value={newAssignment.branch}
                  onValueChange={(value) => setNewAssignment({ ...newAssignment, branch: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch} value={branch}>
                        {branch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Year</Label>
                <Select
                  value={newAssignment.year}
                  onValueChange={(value) => setNewAssignment({ ...newAssignment, year: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateAssignment}>
                Create Assignment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAssignments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalSubmissions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingReviews}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Reviews</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completedReviews}</div>
          </CardContent>
        </Card>
      </div>

      {/* Assignments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Assignments</CardTitle>
          <CardDescription>Manage and track your posted assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <div key={assignment.id || assignment._id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium">{assignment.title}</h3>
                  <p className="text-sm text-gray-600">{assignment.description}</p>
                  <div className="flex gap-4 mt-2">
                    <Badge variant="outline">{assignment.branch}</Badge>
                    <Badge variant="outline">{assignment.year}</Badge>
                    <span className="text-xs text-gray-500">Due: {assignment.deadline}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="font-medium">
                      {assignment.submissionCount}
                    </div>
                    <div className="text-xs text-gray-500">Submissions</div>
                  </div>
                  <Link href={`/teacher/submissions`}>
                    <Button variant="outline" size="sm">
                      View Submissions
                    </Button>
                  </Link>

                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
