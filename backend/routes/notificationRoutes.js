const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const User = require("../models/User");

// Get notifications for student
router.get("/", async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const notifications = await Notification.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate("assignment", "title"); // optional
    
    

    res.status(200).json({ status: "success", data: notifications });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mark a notification as read
router.patch("/:id/mark-read", async (req, res) => {
  try {
    
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.status(200).json({ message: "Marked as read" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a notification
router.delete("/:id", async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Notification deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// PATCH /api/notifications/mark-all-read?email=student@gmail.com
router.patch("/mark-all-read", async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    await Notification.updateMany({ user: user._id }, { read: true });

    res.status(200).json({ message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;