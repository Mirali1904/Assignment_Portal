"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, Upload, Clock, CheckCircle, AlertCircle, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data
const mockAssignments = [
  {
    id: 1,
    title: "Data Structures Assignment",
    description:
      "Implement binary search tree with all operations including insertion, deletion, and traversal methods.",
    deadline: "2024-01-15",
    status: "submitted",
    grade: 8.5,
    subject: "Data Structures",
    teacher: "Dr. Smith",
  },
  {
    id: 2,
    title: "Web Development Project",
    description: "Create a responsive website using React with modern UI components and proper state management.",
    deadline: "2024-01-20",
    status: "pending",
    grade: null,
    subject: "Web Development",
    teacher: "Prof. Johnson",
  },
  {
    id: 3,
    title: "Database Design",
    description: "Design and implement a library management system with proper normalization and relationships.",
    deadline: "2024-01-25",
    status: "not_submitted",
    grade: null,
    subject: "Database Systems",
    teacher: "Dr. Brown",
  },
  {
    id: 4,
    title: "Machine Learning Model",
    description: "Build a classification model for iris dataset using scikit-learn and evaluate its performance.",
    deadline: "2024-01-30",
    status: "graded",
    grade: 9.0,
    subject: "Machine Learning",
    teacher: "Prof. Davis",
  },
  {
    id: 5,
    title: "Network Security Analysis",
    description: "Analyze network vulnerabilities and propose security measures for a given network topology.",
    deadline: "2024-02-05",
    status: "not_submitted",
    grade: null,
    subject: "Network Security",
    teacher: "Dr. Wilson",
  },
]

export default function StudentAssignments() {
  const [assignments] = useState(mockAssignments)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null)
  const { toast } = useToast()

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "submitted":
        return <Badge className="bg-blue-100 text-blue-800">Submitted</Badge>
      case "graded":
        return <Badge className="bg-green-100 text-green-800">Graded</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>
      case "not_submitted":
        return <Badge variant="destructive">Not Submitted</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "submitted":
        return <Upload className="h-5 w-5 text-blue-600" />
      case "graded":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-600" />
      case "not_submitted":
        return <AlertCircle className="h-5 w-5 text-red-600" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setSelectedFile(file)
    } else {
      toast({
        title: "Invalid file type",
        description: "Please select a PDF file.",
        variant: "destructive",
      })
    }
  }

  const handleSubmitAssignment = () => {
    if (selectedFile && selectedAssignment) {
      toast({
        title: "Assignment submitted",
        description: `Your submission for "${selectedAssignment.title}" has been uploaded successfully.`,
      })
      setIsSubmitDialogOpen(false)
      setSelectedFile(null)
      setSelectedAssignment(null)
    }
  }

  const openSubmitDialog = (assignment: any) => {
    setSelectedAssignment(assignment)
    setIsSubmitDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Assignments</h1>
        <p className="text-gray-600">View and submit your assignments</p>
      </div>

      {/* Assignments Grid */}
      <div className="grid gap-6">
        {assignments.map((assignment) => {
          const daysLeft = getDaysUntilDeadline(assignment.deadline)
          const isOverdue = daysLeft < 0
          const isDueSoon = daysLeft <= 3 && daysLeft >= 0

          return (
            <Card
              key={assignment.id}
              className={`${isOverdue ? "border-red-200 bg-red-50" : isDueSoon ? "border-yellow-200 bg-yellow-50" : ""}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(assignment.status)}
                    <div>
                      <CardTitle className="text-lg">{assignment.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {assignment.subject} • {assignment.teacher}
                      </CardDescription>
                    </div>
                  </div>
                  {getStatusBadge(assignment.status)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{assignment.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Due: {assignment.deadline}</span>
                    </div>
                    {isOverdue ? (
                      <Badge variant="destructive" className="text-xs">
                        Overdue by {Math.abs(daysLeft)} days
                      </Badge>
                    ) : isDueSoon ? (
                      <Badge className="bg-yellow-100 text-yellow-800 text-xs">Due in {daysLeft} days</Badge>
                    ) : (
                      <span className="text-green-600">{daysLeft} days left</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {assignment.grade && (
                      <div className="text-right">
                        <div className="font-semibold text-green-600">{assignment.grade}/10</div>
                        <div className="text-xs text-gray-500">Grade</div>
                      </div>
                    )}

                    {assignment.status === "not_submitted" && (
                      <Button onClick={() => openSubmitDialog(assignment)}>
                        <Upload className="h-4 w-4 mr-2" />
                        Submit
                      </Button>
                    )}

                    {assignment.status === "submitted" && (
                      <Button variant="outline" disabled>
                        Submitted
                      </Button>
                    )}

                    {assignment.status === "graded" && <Button variant="outline">View Feedback</Button>}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Submit Assignment Dialog */}
      <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Assignment</DialogTitle>
            <DialogDescription>Upload your assignment file for "{selectedAssignment?.title}"</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file">Upload PDF File</Label>
              <Input id="file" type="file" accept=".pdf" onChange={handleFileChange} />
              {selectedFile && <p className="text-sm text-green-600">Selected: {selectedFile.name}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubmitDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitAssignment} disabled={!selectedFile}>
              Submit Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
