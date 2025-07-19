const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const studentRoutes = require('./routes/studentRoutes');
const submissionRoutes = require("./routes/submissions");
const profile = require("./routes/studentProfile");
const teacherProfileRoutes = require("./routes/teacherProfile");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.use("/api", submissionRoutes);
app.use("/api/p", profile);
app.use("/api/t", teacherProfileRoutes);
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/assignments", require("./routes/assignmentRoutes")); // ✅ This line
app.use("/api/submissions", require("./routes/submissionRoutes"));
app.use("/api/teacher", require("./routes/teacherRoutes"))
app.use('/api/student', studentRoutes);
app.use('/api/notifications', require('./routes/notificationRoutes'));


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error("MongoDB connection error:", err));
