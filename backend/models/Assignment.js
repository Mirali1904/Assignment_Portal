const mongoose = require("mongoose");
const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  deadline: { type: String, required: true },
  branch: { type: String, required: true },
  year: { type: String, required: true },
  submissionCount: { 
    type: Number, 
    default: 0,
    min: 0
  }, 
   totalStudents: { 
    type: Number, 
    default: 0
  },
  submissions: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Submission",
    default: undefined 
  }],
});

module.exports = mongoose.model("Assignment", assignmentSchema);