const express = require("express")
const router = express.Router()

const {
  getTeacherProfile,
  updateTeacherProfile,
} = require("../controllers/teacherController")

router.get("/profile", getTeacherProfile)
router.post("/profile", updateTeacherProfile)

module.exports = router
