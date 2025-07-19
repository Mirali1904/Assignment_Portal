const express = require("express");
const router = express.Router();
const {
  getAssignmentsWithSubmissions,
  gradeSubmission,
} = require("../controllers/submissionController");

router.get("/", getAssignmentsWithSubmissions); // GET /api/submissions
router.put("/:id", gradeSubmission);            // PUT /api/submissions/:id

module.exports = router;
