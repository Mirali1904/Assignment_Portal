const Assignment = require('../models/Assignment');
const User = require('../models/User');
const Submission = require('../models/Submission');

const multer = require("multer");
const path = require("path");

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to accept only PDFs
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") cb(null, true);
  else cb(new Error("Only PDFs are allowed"), false);
};

const upload = multer({ storage, fileFilter });
exports.uploadMiddleware = upload.single("assignmentPdf");



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
            year: student.year
        });

        const submissions = await Submission.find({
            student: student._id // use student's _id
        }).populate('assignment');


        const totalAssignments = assignments.length;
        const completedAssignments = submissions.filter(s =>
            s.status === 'graded' || s.status === 'submitted'
        ).length;

        const averageGrade =
            submissions.reduce((sum, sub) => sum + (sub.grade || 0), 0) / (submissions.length || 1);

        // submissions.forEach((sub, index) => {
        //     console.log(`Submission #${index + 1}:`);
        //     console.log("Assignment:", sub.assignment);
        //     console.log("Status:", sub.status);
        //     console.log("Grade:", sub.grade);
        // });
        

        res.status(200).json({
            status: 'success',
            data: {
                user: {
                    name: student.name,
                    email: student.email
                },
                stats: {
                    totalAssignments,
                    completedAssignments,
                    pendingAssignments: totalAssignments - completedAssignments,
                    averageGrade: averageGrade.toFixed(1)
                },
                recentAssignments: submissions.slice(0, 5).map(sub => ({
                    id: sub.assignment._id,
                    title: sub.assignment.title,
                    description: sub.assignment.description,
                    deadline: sub.assignment.deadline,
                    status: sub.status,
                    grade: sub.grade
                }))
            }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
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

        const submissions = await Submission.find({
            student: student._id
        }).populate('assignment');

        const formattedAssignments = assignments.map(assignment => {
            const submission = submissions.find(sub =>
                sub.assignment._id.equals(assignment._id)
            );

            return {
                id: assignment._id,
                title: assignment.title,
                description: assignment.description,
                deadline: assignment.deadline,
                status: submission?.status || 'not_submitted',
                grade: submission?.grade || null
            };
        });

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
      return res.status(400).json({ message: "Assignment ID and email required" });
    }

    const student = await User.findOne({ email });
    if (!student) return res.status(404).json({ message: "Student not found" });

    if (!req.file) return res.status(400).json({ message: "PDF file is required" });

    // Check if already submitted
    const existingSubmission = await Submission.findOne({
      student: student._id,
      assignment: assignmentId
    });

    if (existingSubmission) {
      return res.status(400).json({ message: "Assignment already submitted" });
    }

    const submission = new Submission({
      assignment: assignmentId,
      student: student._id,
      fileUrl: `/uploads/${req.file.filename}`, // frontend can access this URL
      status: "submitted",
    });

    await submission.save();

    // Optional: update submissionCount in assignment
    await Assignment.findByIdAndUpdate(assignmentId, {
      $inc: { submissionCount: 1 },
      $push: { submissions: submission._id }
    });

    res.status(201).json({
      status: "success",
      message: "Assignment submitted successfully",
      data: submission
    });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};
