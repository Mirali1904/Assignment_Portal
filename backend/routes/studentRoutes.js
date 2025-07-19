  const express = require('express');
  const router = express.Router();
  const studentController = require('../controllers/studentController')
  const upload = require("../config/upload");
  
  const {
    getStudentDashboard,
    getStudentAssignments
  } = require('../controllers/studentController');


  router.get('/dashboard', getStudentDashboard);
  router.get('/assignments', getStudentAssignments);
  router.post(
    "/submit",
    // protect,
    upload.single("assignmentPdf"), // Multer middleware
    studentController.submitAssignment
  );

  module.exports = router;