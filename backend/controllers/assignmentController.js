const Assignment = require("../models/Assignment");

const User = require("../models/User");
const Notification = require("../models/Notification"); // ✅ import
const Submission = require("../models/Submission"); // ✅ import

const createAssignment = async (req, res) => {
  const { title, description, deadline, branch, year } = req.body;

  if (!title || !description || !deadline || !branch || !year) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const assignment = await Assignment.create({
      title,
      description,
      deadline: new Date(deadline),
      branch,
      year
    });

    const students = await User.find({ role: "student", branch, year });

    const notifications = students.map((student) => ({
      user: student._id,
      message: `New assignment posted: "${title}"`,
      type: 'new_assignment',
      assignment: assignment._id,
    }));

    await Notification.insertMany(notifications);

    res.status(201).json({ message: "Assignment created", assignment });
  } catch (error) {
    console.error("Create assignment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate({
        path: "submissions",
        populate: {
          path: "student",
          select: "name email", 
        },
      });

    const transformedAssignments = assignments.map((a) => ({
      id: a._id,
      title: a.title,
      branch: a.branch,
      year: a.year,
      deadline: a.deadline,
      description: a.description,
      submissionCount: a.submissions.length,
      submissions: a.submissions.map((s) => ({
        _id: s._id,
        studentName: s.student?.name || "N/A",
        studentEmail: s.student?.email || "N/A",
        submittedAt: s.submittedAt,
        status: s.status,
        grade: s.grade,
        feedback: s.feedback,
        fileUrl : s.fileUrl || "",
      })),
    }));

    const totalSubmissions = await Submission.countDocuments();
    const pendingReviews = await Submission.countDocuments({ status: "pending" });
    const completedReviews = await Submission.countDocuments({ status: "graded" });

    res.status(200).json({
      assignments: transformedAssignments,
      stats: {
        totalAssignments: assignments.length,
        totalSubmissions,
        pendingReviews,
        completedReviews,
      },
    });
  } catch (error) {
    console.error("Fetch assignments error:", error);
    res.status(500).json({ message: "Server error" });
  }
};




module.exports = {
  createAssignment,
  getAllAssignments,
};
