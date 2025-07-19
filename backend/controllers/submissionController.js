
const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");

// GET: Get all assignments with submissions
exports.getAssignmentsWithSubmissions = async (req, res) => {
  try {
    const assignments = await Assignment.find().populate("submissions");
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// PUT: Grade a submission
exports.gradeSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { grade, feedback } = req.body;

    const submission = await Submission.findByIdAndUpdate(
      id,
      {
        grade,
        feedback,
        status: "graded",
      },
      { new: true }
    );

    if (!submission) {
      return res.status(404).json({ error: "Submission not found" });
    }

    res.json({ message: "Submission graded", submission });
  } catch (error) {
    res.status(500).json({ error: "Failed to grade submission" });
  }
};
