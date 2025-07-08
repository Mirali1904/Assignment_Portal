"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Mail, BookOpen, Calendar, Award, Edit, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function TeacherProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    department: "Computer Science",
    employeeId: "EMP001",
  })
  const { toast } = useToast()

  useEffect(() => {
    // Load profile data from localStorage
    setProfileData({
      name: localStorage.getItem("userName") || "Dr. John Smith",
      email: localStorage.getItem("userEmail") || "john.smith@college.edu",
      department: "Computer Science",
      employeeId: "EMP001",
    })
  }, [])

  const handleSaveProfile = () => {
    localStorage.setItem("userName", profileData.name)
    localStorage.setItem("userEmail", profileData.email)

    setIsEditing(false)
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    })
  }

  // Mock assignment statistics
  const teachingStats = {
    totalAssignments: 15,
    activeAssignments: 8,
    totalSubmissions: 245,
    pendingReviews: 32,
    averageGrade: 7.8,
  }

  // Mock posted assignments
  const postedAssignments = [
    { title: "Data Structures Assignment", submissions: 25, deadline: "2024-01-15" },
    { title: "Web Development Project", submissions: 18, deadline: "2024-01-20" },
    { title: "Database Design", submissions: 12, deadline: "2024-01-25" },
    { title: "Machine Learning Model", submissions: 8, deadline: "2024-01-30" },
    { title: "Network Security Analysis", submissions: 5, deadline: "2024-02-05" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600">Manage your personal information and view your teaching statistics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Personal Information</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                  <Edit className="h-4 w-4 mr-2" />
                  {isEditing ? "Cancel" : "Edit"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl">
                    {profileData.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{profileData.name}</h3>
                  <p className="text-gray-600">{profileData.employeeId}</p>
                  <Badge className="mt-1">{profileData.department}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input id="department" value={profileData.department} disabled className="pl-10" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employeeId">Employee ID</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input id="employeeId" value={profileData.employeeId} disabled className="pl-10" />
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSaveProfile}>Save Changes</Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Posted Assignments */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Assignments</CardTitle>
              <CardDescription>Your recently posted assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {postedAssignments.map((assignment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <div>
                        <div className="font-medium">{assignment.title}</div>
                        <div className="text-sm text-gray-600">Due: {assignment.deadline}</div>
                      </div>
                    </div>
                    <Badge variant="outline">{assignment.submissions} submissions</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Teaching Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Teaching Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{teachingStats.averageGrade}</div>
                <div className="text-sm text-gray-600">Average Class Grade</div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Assignments</span>
                  <span className="font-medium">{teachingStats.totalAssignments}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active Assignments</span>
                  <span className="font-medium text-blue-600">{teachingStats.activeAssignments}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Submissions</span>
                  <span className="font-medium text-green-600">{teachingStats.totalSubmissions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Pending Reviews</span>
                  <span className="font-medium text-yellow-600">{teachingStats.pendingReviews}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Teaching Achievements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Award className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <div className="font-medium text-sm">Excellent Feedback</div>
                  <div className="text-xs text-gray-600">4.8/5 student rating</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Award className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-sm">Quick Grader</div>
                  <div className="text-xs text-gray-600">Average 2-day turnaround</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Award className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-sm">Active Educator</div>
                  <div className="text-xs text-gray-600">15 assignments this semester</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
