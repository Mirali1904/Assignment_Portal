const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");

router.get("/student/profile", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await User.findOne({ email });
    if (!user || user.role !== "student") {
      return res.status(404).json({ error: "Student not found" });
    }

    const { branch, year, name } = user;

    // Step 1: Fetch all assignments for this student's branch/year
    const allAssignments = await Assignment.find({ branch, year });
    const totalAssignments = allAssignments.length;

    // Step 2: Fetch all submissions made by the student
    const submissions = await Submission.find({ student: user._id });

    // Get the assignment IDs from the student's submissions
    const submittedAssignmentIds = submissions.map(sub => sub.assignment.toString());

    // Step 3: Count completed assignments (submitted & graded or pending)
    const completedAssignments = submissions.filter(
      sub => sub.status === "graded" || sub.status === "pending"
    ).length;

    // Step 4: Count pending assignments (total - completed)
    const pendingAssignments = totalAssignments - completedAssignments;

    // Step 5: Count overdue assignments from unsubmitted ones
    const now = new Date();
    const unsubmittedAssignments = allAssignments.filter(
      assignment => !submittedAssignmentIds.includes(assignment._id.toString())
    );
    const overdueAssignments = unsubmittedAssignments.filter(
      assignment => assignment.deadline < now
    ).length;

    // Step 6: Calculate average grade
    const gradedSubmissions = submissions.filter(sub => sub.grade !== undefined);
    const totalGrades = gradedSubmissions.reduce((sum, sub) => sum + (sub.grade || 0), 0);
    const averageGrade =
      gradedSubmissions.length > 0
        ? (totalGrades / gradedSubmissions.length).toFixed(1)
        : 0;

    // Response
    res.json({
      name,
      email: user.email,
      branch,
      year,
      studentId: user._id,
      assignmentStats: {
        total: totalAssignments,
        completed: completedAssignments,
        pending: pendingAssignments,
        overdue: overdueAssignments,
        averageGrade,
      },
    });
  } catch (error) {
    console.error("Error fetching student profile:", error);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
