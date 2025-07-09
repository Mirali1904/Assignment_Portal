const Assignment = require("../models/Assignment");

const createAssignment = async (req, res) => {
  const { title, description, deadline, branch, year } = req.body;

  if (!title || !description || !deadline || !branch || !year) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const assignment = new Assignment({
      title,
      description,
      deadline,
      branch,
      year,
      submissions: 0,
      totalStudents: Math.floor(Math.random() * 20) + 20, // Mock for now
    });

    await assignment.save();
    res.status(201).json({ message: "Assignment created", assignment });
  } catch (error) {
    console.error("Create assignment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find();
    res.status(200).json(assignments);
  } catch (error) {
    console.error("Fetch assignments error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createAssignment,
  getAllAssignments,
};
