const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  assignment: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Assignment',
    required: true 
  },
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  submittedAt: { 
    type: Date, 
    default: Date.now 
  },
  fileUrl: String,
  status: { 
    type: String, 
    enum: ['graded', 'pending'],
    default: '' 
  },
  grade: { 
    type: Number, 
    min: 0, 
    max: 10 
  },
  feedback: String
}, { timestamps: true });

module.exports = mongoose.model('Submission', submissionSchema);