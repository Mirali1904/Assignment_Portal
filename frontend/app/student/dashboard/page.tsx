"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FileText, Upload, Clock, CheckCircle, AlertCircle } from "lucide-react"

interface Assignment {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: "submitted" | "graded" | "pending" | "not_submitted";
  grade: number | null;
}

interface DashboardData {
  user: {
    name: string;
    email: string;
  };
  stats: {
    totalAssignments: number;
    completedAssignments: number;
    averageGrade: number;
  };
  recentAssignments: Assignment[];
}

interface DashboardStats {
  totalAssignments: number;
  completedAssignments: number;
  pendingAssignments: number;
  averageGrade: number;
}

export default function StudentDashboard() {

  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [userName, setUserName] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const email = localStorage.getItem("userEmail");

        if (!email) throw new Error("User not logged in");

        // Fetch student dashboard data
        const userResponse = await fetch(`http://localhost:5000/api/student/dashboard?email=${email}`);
        if (!userResponse.ok) throw new Error("Failed to fetch user data");
        const userData = await userResponse.json();
        setUserName(userData.data.user.name);
        setStats(userData.data.stats);

        // Fetch assignments data
        const assignmentsResponse = await fetch(`http://localhost:5000/api/student/assignments?email=${email}`);
        if (!assignmentsResponse.ok) throw new Error("Failed to fetch assignments");
        const assignmentsData = await assignmentsResponse.json();
        setAssignments(assignmentsData.data);


      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);




  const getStatusBadge = (status: string) => {
    switch (status) {
      case "submitted":
        return <Badge className="bg-blue-100 text-blue-800">Submitted</Badge>
      case "graded":
        return <Badge className="bg-green-100 text-green-800">Graded</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "not_submitted":
        return <Badge variant="destructive">Not Submitted</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted":
        return <Upload className="h-4 w-4 text-blue-600" />
      case "graded":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "not_submitted":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
  }

  if (!stats) return <div className="text-center">Loading stats...</div>;

  const { totalAssignments, completedAssignments, averageGrade, pendingAssignments } = stats;
  const completionPercentage = totalAssignments > 0 ? (completedAssignments / totalAssignments) * 100 : 0;


  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {userName}!</h1>
        <p className="text-gray-600">Here's an overview of your assignments and progress.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAssignments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedAssignments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {pendingAssignments}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
            <Badge className="h-4 w-4 rounded-full bg-blue-100" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {averageGrade}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Section */}
      <Card>
        <CardHeader>
          <CardTitle>Assignment Progress</CardTitle>
          <CardDescription>Your overall completion progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>
                Completed: {completedAssignments}/{totalAssignments}
              </span>
              <span>{completionPercentage.toFixed(0)}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Recent Assignments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Assignments</CardTitle>
          <CardDescription>Your latest assignment submissions and deadlines</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(assignment.status)}
                  <div>
                    <h3 className="font-medium">{assignment.title}</h3>
                    <p className="text-sm text-gray-600">{assignment.description}</p>
                    <p className="text-xs text-gray-500">Due: {assignment.deadline}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {assignment.grade && (
                    <div className="text-right">
                      <div className="font-medium text-green-600">{assignment.grade}/10</div>
                      <div className="text-xs text-gray-500">Grade</div>
                    </div>
                  )}
                  {getStatusBadge(assignment.status)}
                  {assignment.status === "not_submitted" && (
                    <Button size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Submit
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
