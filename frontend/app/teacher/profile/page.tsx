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
import { useToast } from "@/components/hooks/use-toast"

export default function TeacherProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    department: "Computer Science",
    employeeId: "",
  })

  type TeachingStats = {
  totalAssignments: number
  activeAssignments: number
  totalSubmissions: number
  pendingReviews: number
  averageGrade: number
}

const [teachingStats, setTeachingStats] = useState<TeachingStats>({
  totalAssignments: 0,
  activeAssignments: 0,
  totalSubmissions: 0,
  pendingReviews: 0,
  averageGrade: 0,
})


  type AssignmentItem = {
  title: string
  submissions: number
  deadline: string
}

const [postedAssignments, setPostedAssignments] = useState<AssignmentItem[]>([])

  const { toast } = useToast()

  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const email = localStorage.getItem("userEmail")
      const res = await fetch(`http://localhost:5000/api/t/teacher/profile?email=${email}`)
      const data = await res.json()

      setProfileData({
        name: data.name,
        email: data.email,
        department: data.department,
        employeeId: data.employeeId,
      })

      setTeachingStats(data.teachingStats)
      setPostedAssignments(data.recentAssignments)
    } catch (error) {
      console.error("Failed to load teacher profile:", error)
    }
  }

  fetchProfile()
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
        
      </div>
    </div>
  )
}
