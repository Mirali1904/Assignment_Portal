const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");

router.get("/teacher/profile", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email is required" });

    // 1. Get teacher user
    const teacher = await User.findOne({ email, role: "teacher" });
    if (!teacher) return res.status(404).json({ error: "Teacher not found" });

    const teacherId = teacher._id;
    const name = teacher.name;
    const department = teacher.branch;

    const postedAssignments = await Assignment.find({}).populate("submissions");


    console.log("Posted Assignments:", postedAssignments);

    const totalAssignments = postedAssignments.length;

    const activeAssignments = postedAssignments.filter(a => new Date(a.deadline) > new Date()).length;

    // 3. Collect all submissions for assignments posted by this teacher
    const allSubmissions = postedAssignments.flatMap(a => a.submissions);

    const submissions = await Submission.find({ _id: { $in: allSubmissions } });

    const totalSubmissions = submissions.length;

    const pendingReviews = submissions.filter(sub => sub.status === "pending").length;

    const gradedSubmissions = submissions.filter(sub => sub.status === "graded" && sub.grade !== undefined);
    const totalGrades = gradedSubmissions.reduce((acc, curr) => acc + (curr.grade || 0), 0);
    const averageGrade = gradedSubmissions.length > 0
      ? (totalGrades / gradedSubmissions.length).toFixed(1)
      : 0;


    res.json({
      name,
      email,
      department,
      employeeId: teacherId,
      teachingStats: {
        totalAssignments,
        activeAssignments,
        totalSubmissions,
        pendingReviews,
        averageGrade: parseFloat(averageGrade),
      },
      recentAssignments: postedAssignments.slice(-5).map(a => ({
        title: a.title,
        submissions: a.submissions.length,
        deadline: a.deadline,
      })),
    });
  } catch (error) {
    console.error("Error fetching teacher profile:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
