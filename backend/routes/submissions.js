const express = require("express");
const router = express.Router();
const Submission = require("../models/Submission");
const Assignment = require("../models/Assignment");
const Notification = require("../models/Notification");


router.post("/submissions/:id/grade", async (req, res) => {
    console.log(req.body);
    
  const { id } = req.params;
  const { grade, feedback } = req.body;

  try {
    const submission = await Submission.findById(id).populate("student assignment");
    if (!submission) return res.status(404).json({ message: "Submission not found" });

    submission.grade = grade;
    submission.feedback = feedback;
    submission.status = "graded";
    await submission.save();

    await Notification.create({
      user: submission.student._id,
      assignment: submission.assignment._id,
      type: "grade_received",
      message: `Your submission for "${submission.assignment.title}" has been graded.`,
    });

    res.status(200).json({ message: "Submission graded successfully" });
  } catch (error) {
    console.error("Grade error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ 2. Reject Submission
router.delete("/submissions/:id/reject", async (req, res) => {
  const { id } = req.params;

  try {
    const submission = await Submission.findById(id).populate("student assignment");
    if (!submission) return res.status(404).json({ message: "Submission not found" });

    const assignmentId = submission.assignment._id;

    // Remove submission from assignment
    await Assignment.findByIdAndUpdate(assignmentId, {
      $pull: { submissions: submission._id },
      $inc: { submissionCount: -1 },
    });

    await Notification.create({
      user: submission.student._id,
      assignment: assignmentId,
      type: "feedback_available",
      message: `Your submission for "${submission.assignment.title}" was rejected. Please resubmit.`,
    });

    // Delete the submission
    await Submission.findByIdAndDelete(id);

    res.status(200).json({ message: "Submission rejected and deleted" });
  } catch (error) {
    console.error("Reject error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
