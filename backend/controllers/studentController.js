const Assignment = require("../models/Assignment");
const User = require("../models/User");
const Submission = require("../models/Submission");



exports.getStudentDashboard = async (req, res) => {
  try {
    const userEmail = req.query.email;

    if (!userEmail) {
      return res.status(400).json({ message: "Email is required" });
    }

    const student = await User.findOne({ email: userEmail });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const assignments = await Assignment.find({
      branch: student.branch,
      year: student.year,
    });

    const submissions = await Submission.find({
      student: student._id,
    }).populate("assignment");

    const totalAssignments = assignments.length;
    
    const completedAssignments = submissions.filter(
      (s) => s.status === "graded" || s.status === "pending"
    ).length;

    const averageGrade =
      submissions.reduce((sum, sub) => sum + (sub.grade || 0), 0) /
      (submissions.length || 1);

    res.status(200).json({
      status: "success",
      data: {
        user: {
          name: student.name,
          email: student.email,
        },
        stats: {
          totalAssignments,
          completedAssignments,
          pendingAssignments: totalAssignments - completedAssignments,
          averageGrade: averageGrade.toFixed(1),
        },
        recentAssignments: submissions.slice(0, 5).map((sub) => ({
          id: sub.assignment._id,
          title: sub.assignment.title,
          description: sub.assignment.description,
          deadline: sub.assignment.deadline,
          status: sub.status,
          grade: sub.grade,
        })),
      },
    });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.getStudentAssignments = async (req, res) => {
  try {
    const userEmail = req.query.email;

    if (!userEmail) {
      return res.status(400).json({ message: "Email is required" });
    }

    const student = await User.findOne({ email: userEmail });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    
    const assignments = await Assignment.find({
      branch: student.branch,
      year: student.year
    });

    

    // Get all submissions by this student
    const submissions = await Submission.find({
      student: student._id
    });

    // Get IDs of assignments the student already submitted
    const submittedAssignmentIds = submissions.map(sub => sub.assignment.toString());

    // Filter out submitted assignments
    const unsubmittedAssignments = assignments.filter(
      assignment => !submittedAssignmentIds.includes(assignment._id.toString())
    );

    // Format response
    const formattedAssignments = unsubmittedAssignments.map(assignment => ({
      id: assignment._id,
      title: assignment.title,
      description: assignment.description,
      deadline: assignment.deadline,
      status: "pending", // Always pending, since not yet submitted
      grade: null,
      length : assignment.length
    }));

    res.status(200).json({
      status: 'success',
      results: formattedAssignments.length,
      data: formattedAssignments
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};


exports.submitAssignment = async (req, res) => {
  try {
    const { assignmentId, email } = req.body;

    if (!assignmentId || !email) {
      return res
        .status(400)
        .json({ message: "Assignment ID and email required" });
    }

    const student = await User.findOne({ email });
    if (!student)
      return res.status(404).json({ message: "Student not found" });

    if (!req.file)
      return res.status(400).json({ message: "PDF file is required" });

    const existingSubmission = await Submission.findOne({
      student: student._id,
      assignment: assignmentId,
    });

    if (existingSubmission) {
      return res
        .status(400)
        .json({ message: "Assignment already submitted" });
    }

    const submission = new Submission({
      assignment: assignmentId,
      student: student._id,
      fileUrl: req.file.path, // ✅ Cloudinary returns secure URL in `path`
      status: "pending",
    });

    await submission.save();

    await Assignment.findByIdAndUpdate(assignmentId, {
      $inc: { submissionCount: 1 },
      $push: { submissions: submission._id },
    });

    res.status(201).json({
      status: "success",
      message: "Assignment submitted successfully",
      data: submission,
    });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};
