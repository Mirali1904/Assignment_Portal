const express = require('express');
const router = express.Router();
const {
  getStudentDashboard,
  getStudentAssignments
} = require('../controllers/studentController');


router.get('/dashboard', getStudentDashboard);
router.get('/assignments', getStudentAssignments);

module.exports = router;