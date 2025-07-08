"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Bot, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data
const mockAssignments = [
  {
    id: 1,
    title: "Data Structures Assignment",
    submissions: [
      {
        id: 1,
        studentName: "John Doe",
        studentId: "CS2021001",
        submittedAt: "2024-01-14T10:30:00Z",
        status: "pending",
        grade: null,
        feedback: "",
      },
      {
        id: 2,
        studentName: "Jane Smith",
        studentId: "CS2021002",
        submittedAt: "2024-01-13T15:45:00Z",
        status: "graded",
        grade: 8.5,
        feedback: "Good implementation of BST operations. Consider optimizing the deletion method.",
      },
      {
        id: 3,
        studentName: "Mike Johnson",
        studentId: "CS2021003",
        submittedAt: "2024-01-15T09:20:00Z",
        status: "pending",
        grade: null,
        feedback: "",
      },
    ],
  },
  {
    id: 2,
    title: "Web Development Project",
    submissions: [
      {
        id: 4,
        studentName: "Sarah Wilson",
        studentId: "IT2021001",
        submittedAt: "2024-01-19T14:30:00Z",
        status: "pending",
        grade: null,
        feedback: "",
      },
      {
        id: 5,
        studentName: "David Brown",
        studentId: "IT2021002",
        submittedAt: "2024-01-18T11:15:00Z",
        status: "graded",
        grade: 9.0,
        feedback: "Excellent responsive design and clean code structure.",
      },
    ],
  },
]

export default function TeacherSubmissions() {
  const [assignments] = useState(mockAssignments)
  const [selectedAssignment, setSelectedAssignment] = useState(mockAssignments[0])
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null)
  const [isGradeDialogOpen, setIsGradeDialogOpen] = useState(false)
  const [grade, setGrade] = useState("")
  const [feedback, setFeedback] = useState("")
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null)
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false)
  const { toast } = useToast()

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString() + " " + new Date(timestamp).toLocaleTimeString()
  }

  const handleGradeSubmission = () => {
    if (selectedSubmission && grade && feedback) {
      toast({
        title: "Submission graded",
        description: `Grade ${grade}/10 assigned to ${selectedSubmission.studentName}`,
      })
      setIsGradeDialogOpen(false)
      setGrade("")
      setFeedback("")
      setSelectedSubmission(null)
    }
  }

  const handleAiAnalysis = async (submission: any) => {
    setIsAiAnalyzing(true)
    setAiAnalysis(null)

    // Simulate AI analysis
    setTimeout(() => {
      const aiProbability = Math.floor(Math.random() * 30) + 10 // Random percentage between 10-40%
      setAiAnalysis(
        `AI Detection Analysis: ${aiProbability}% probability of AI-generated content. The submission shows ${aiProbability < 20 ? "minimal" : aiProbability < 30 ? "moderate" : "significant"} signs of AI assistance.`,
      )
      setIsAiAnalyzing(false)
    }, 2000)
  }

  const openGradeDialog = (submission: any) => {
    setSelectedSubmission(submission)
    setGrade(submission.grade?.toString() || "")
    setFeedback(submission.feedback || "")
    setIsGradeDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Student Submissions</h1>
        <p className="text-gray-600">Review and grade student assignment submissions</p>
      </div>

      {/* Assignment Selector */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {assignments.map((assignment) => (
          <Button
            key={assignment.id}
            variant={selectedAssignment.id === assignment.id ? "default" : "outline"}
            onClick={() => setSelectedAssignment(assignment)}
            className="whitespace-nowrap"
          >
            {assignment.title}
            <Badge className="ml-2" variant="secondary">
              {assignment.submissions.length}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Submissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>{selectedAssignment.title} - Submissions</CardTitle>
          <CardDescription>Review and grade submissions for this assignment</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Student ID</TableHead>
                <TableHead>Submitted At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedAssignment.submissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium">{submission.studentName}</TableCell>
                  <TableCell>{submission.studentId}</TableCell>
                  <TableCell>{formatTimestamp(submission.submittedAt)}</TableCell>
                  <TableCell>
                    {submission.status === "pending" ? (
                      <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                    ) : (
                      <Badge className="bg-green-100 text-green-800">Graded</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {submission.grade ? (
                      <span className="font-medium text-green-600">{submission.grade}/10</span>
                    ) : (
                      <span className="text-gray-400">Not graded</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View PDF
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button size="sm" onClick={() => openGradeDialog(submission)}>
                        {submission.status === "pending" ? "Grade" : "Edit Grade"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAiAnalysis(submission)}
                        disabled={isAiAnalyzing}
                      >
                        <Bot className="h-4 w-4 mr-1" />
                        {isAiAnalyzing ? "Analyzing..." : "Check AI"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* AI Analysis Results */}
      {aiAnalysis && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-600" />
              AI Detection Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-800">{aiAnalysis}</p>
          </CardContent>
        </Card>
      )}

      {/* Grade Submission Dialog */}
      <Dialog open={isGradeDialogOpen} onOpenChange={setIsGradeDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Grade Submission</DialogTitle>
            <DialogDescription>Grade submission by {selectedSubmission?.studentName}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="grade">Grade (out of 10)</Label>
              <Input
                id="grade"
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="Enter grade"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedback">Feedback</Label>
              <Textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Provide feedback to the student..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGradeDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleGradeSubmission} disabled={!grade || !feedback}>
              Save Grade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
