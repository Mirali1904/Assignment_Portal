const express = require("express");
const router = express.Router();
const { createAssignment, getAllAssignments } = require("../controllers/assignmentController");

router.post("/", createAssignment);
router.get("/", getAllAssignments);

module.exports = router;
