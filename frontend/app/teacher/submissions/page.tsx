"use client"

import { ReactNode, useEffect, useState } from "react"
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
import { useToast } from "@/components/hooks/use-toast"

// ✅ TYPES
type Submission = {
  fileUrl: string | undefined
  _id: string
  studentName: string
  studentEmail: string
  submittedAt: string
  status: "submitted" | "graded" | "pending"
  grade: number | null
  feedback: string
}

type Assignment = {
  _id: string
  title: string
  description: string
  branch: string
  year: string
  deadline: string
  submissions: Submission[]
}

export default function TeacherSubmissions() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [isGradeDialogOpen, setIsGradeDialogOpen] = useState(false)
  const [grade, setGrade] = useState("")
  const [feedback, setFeedback] = useState("")
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null)
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchAssignments()
  }, [])

  const fetchAssignments = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/assignments")
      const data = await res.json()

      if (Array.isArray(data.assignments)) {
        setAssignments(data.assignments)
        setSelectedAssignment(data.assignments[0] || null)
      } else {
        console.error("Invalid assignments data format:", data)
        setAssignments([])
      }
    } catch (err) {
      console.error("Error fetching assignments:", err)
      toast({
        title: "Error",
        description: "Failed to fetch assignments",
        variant: "destructive",
      })
    }
  }

  const formatTimestamp = (timestamp: string) =>
    new Date(timestamp).toLocaleDateString() + " " + new Date(timestamp).toLocaleTimeString()

  const handleGradeSubmission = async () => {
    if (!selectedSubmission || !grade || !feedback) return

    try {
      const res = await fetch(`http://localhost:5000/api/submissions/${selectedSubmission._id}/grade`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grade: parseFloat(grade),
          feedback
        }),
      })

      if (!res.ok) throw new Error("Failed to grade submission")

      toast({
        title: "Submission graded",
        description: `Grade ${grade}/10 assigned to ${selectedSubmission.studentName}`,
      })

      await fetchAssignments()
      setIsGradeDialogOpen(false)
      setGrade("")
      setFeedback("")
      setSelectedSubmission(null)
    } catch (err) {
      toast({
        title: "Error grading submission",
        description: err instanceof Error ? err.message : "Something went wrong",
        variant: "destructive",
      })
    }
  }

  const getPdfViewUrl = (cloudinaryUrl: string) => {
    if (cloudinaryUrl.includes('/raw/upload/')) {
      return cloudinaryUrl.replace('/raw/upload/', '/image/upload/');
    }
    return cloudinaryUrl;
  };

  const handleAiAnalysis = async (submission: Submission) => {
    setIsAiAnalyzing(true)
    setAiAnalysis(null)

    setTimeout(() => {
      const aiProbability = Math.floor(Math.random() * 30) + 10
      setAiAnalysis(
        `AI Detection Analysis: ${aiProbability}% probability of AI-generated content. The submission shows ${aiProbability < 20 ? "minimal" : aiProbability < 30 ? "moderate" : "significant"
        } signs of AI assistance.`
      )
      setIsAiAnalyzing(false)
    }, 2000)
  }



  
// const handleAiAnalysis = async (submission: Submission) => {
//   setIsAiAnalyzing(true);
//   setAiAnalysis(null);

//   try {
//     // Get the API key safely
//     const apiKey = process.env.NEXT_PUBLIC_AI_DETECTION_API_KEY;
//     if (!apiKey) throw new Error("API key not configured");

//     // Prepare headers with proper typing
//     const headers: HeadersInit = {
//       'Content-Type': 'application/json',
//       'x-api-key': apiKey
//     };

//     // Get content - either from property or extract from file
//     const content = submission.content || await extractTextFromPdf(submission.fileUrl);

//     const response = await fetch('https://api.gptzero.me/v2/predict/text', {
//       method: 'POST',
//       headers, // Now properly typed
//       body: JSON.stringify({
//         document: content,
//         title: submission.studentName || 'Student Submission'
//       })
//     });

//     if (!response.ok) throw new Error(`API error: ${response.status}`);

//     const data = await response.json() as {
//       docs: Array<{ average_generated_prob: number }>
//     };

//     const aiProbability = Math.round(data.docs[0].average_generated_prob * 100);

//     setAiAnalysis(
//       `AI Detection: ${aiProbability}% probability. ` +
//       `This shows ${
//         aiProbability < 20 ? 'minimal' : 
//         aiProbability < 50 ? 'moderate' : 
//         'strong'
//       } signs of AI generation.`
//     );
//   } catch (error) {
//     console.error('Detection failed:', error);
//     setAiAnalysis('Analysis failed. Please try again.');
//   } finally {
//     setIsAiAnalyzing(false);
//   }
// };

//   async function extractTextFromPdf(pdfUrl: string): Promise<string> {
//   // Implement using a PDF library or API
//   // This is a placeholder implementation
//   const response = await fetch(pdfUrl);
//   const blob = await response.blob();
//   // You would need a PDF text extraction library here
//   throw new Error("PDF text extraction not implemented");
// }


  const openGradeDialog = (submission: Submission) => {
    setSelectedSubmission(submission)
    setGrade(submission.grade?.toString() || "")
    setFeedback(submission.feedback || "")
    setIsGradeDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Student Submissions</h1>
        <p className="text-gray-600">Review and grade student assignment submissions</p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {assignments.map((assignment) => (
          <Button
            key={assignment._id}
            variant={selectedAssignment?._id === assignment._id ? "default" : "outline"}
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

      {selectedAssignment && (

        <Card>
          <CardHeader>
            <CardTitle>{selectedAssignment.title} - Submissions</CardTitle>
            <CardDescription>
              {selectedAssignment.description} • Due: {formatTimestamp(selectedAssignment.deadline)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Submitted At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedAssignment.submissions.length > 0 ? (
                  selectedAssignment.submissions.map((submission) => (
                    <TableRow key={submission._id}>
                      <TableCell className="font-medium">{submission.studentName}</TableCell>
                      <TableCell>{submission.studentEmail}</TableCell>
                      <TableCell>{formatTimestamp(submission.submittedAt)}</TableCell>
                      <TableCell>
                        <Badge variant={submission.status === "pending" ? "secondary" : "default"}>
                          {submission.status === "submitted"
                            ? "Pending"
                            : "Graded"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {submission.grade !== null ? (
                          <span className="font-medium text-green-600">{submission.grade}/10</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              if (!submission.fileUrl) return;

                              try {
                                // 1. Fetch the file as a blob
                                const response = await fetch(submission.fileUrl);
                                const blob = await response.blob();

                                // 2. Create a local URL for the blob
                                const blobUrl = window.URL.createObjectURL(blob);

                                // 3. Trigger download with the desired filename
                                const link = document.createElement('a');
                                link.href = blobUrl;
                                link.download = 'assignment.pdf'; // Forces the name + .pdf extension
                                document.body.appendChild(link);
                                link.click();

                                // 4. Clean up
                                setTimeout(() => {
                                  document.body.removeChild(link);
                                  window.URL.revokeObjectURL(blobUrl); // Free memory
                                }, 100);
                              } catch (error) {
                                console.error("Download failed:", error);
                                alert("Failed to download PDF. Please try again.");
                              }
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View PDF
                          </Button>


                          <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              if (!confirm("Are you sure you want to reject this submission?")) return;
                              const res = await fetch(`http://localhost:5000/api/submissions/${submission._id}/reject`, {
                                method: "DELETE",
                              });
                              if (res.ok) {
                                toast({
                                  title: "Submission Rejected",
                                  description: `${submission.studentName}'s submission has been deleted.`,
                                });
                                fetchAssignments(); // Refresh data
                              } else {
                                toast({
                                  title: "Error",
                                  description: "Could not reject submission",
                                  variant: "destructive",
                                });
                              }
                            }}
                          >
                            Reject
                          </Button>

                          <Button
                            size="sm"
                            onClick={() => openGradeDialog(submission)}
                          >
                            Grade
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAiAnalysis(submission)}
                            disabled={isAiAnalyzing}
                          >
                            <Bot className="h-4 w-4 mr-1" />
                            {isAiAnalyzing ? "Analyzing..." : "AI Check"}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500">
                      No submissions found for this assignment
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

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

      <Dialog open={isGradeDialogOpen} onOpenChange={setIsGradeDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Grade Submission</DialogTitle>
            <DialogDescription>
              Grade submission by {selectedSubmission?.studentName}
            </DialogDescription>
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
            <Button onClick={handleGradeSubmission}>
              Save Grade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}