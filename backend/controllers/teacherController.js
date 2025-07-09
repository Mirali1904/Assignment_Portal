let teacherProfile = {
  name: "Dr. John Smith",
  email: "john.smith@college.edu",
  department: "Computer Science",
  employeeId: "EMP001",
  stats: {
    totalAssignments: 15,
    activeAssignments: 8,
    totalSubmissions: 245,
    pendingReviews: 32,
    averageGrade: 7.8,
  },
  recentAssignments: [
    { title: "Data Structures Assignment", submissions: 25, deadline: "2024-01-15" },
    { title: "Web Development Project", submissions: 18, deadline: "2024-01-20" },
    { title: "Database Design", submissions: 12, deadline: "2024-01-25" },
    { title: "Machine Learning Model", submissions: 8, deadline: "2024-01-30" },
    { title: "Network Security Analysis", submissions: 5, deadline: "2024-02-05" },
  ],
}

exports.getTeacherProfile = (req, res) => {
  res.json(teacherProfile)
}

exports.updateTeacherProfile = (req, res) => {
  const { name, email } = req.body
  if (name) teacherProfile.name = name
  if (email) teacherProfile.email = email
  res.json({ message: "Profile updated", profile: teacherProfile })
}
