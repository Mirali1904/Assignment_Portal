const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  studentName: String,
  studentId: String,
  submittedAt: Date,
  assignment: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment" },
  status: { type: String, default: "pending" },
  grade: Number,
  feedback: String
});

module.exports = mongoose.model("Submission", submissionSchema);
