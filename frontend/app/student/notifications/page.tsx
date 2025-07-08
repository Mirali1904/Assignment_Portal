"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, FileText, CheckCircle, Clock, Trash2 } from "lucide-react"

// Mock notifications data
const mockNotifications = [
  {
    id: 1,
    type: "new_assignment",
    title: "New Assignment Posted",
    message: "Dr. Smith has posted a new assignment: 'Advanced Algorithms'",
    timestamp: "2024-01-10T10:30:00Z",
    read: false,
    assignment: "Advanced Algorithms",
  },
  {
    id: 2,
    type: "grade_received",
    title: "Assignment Graded",
    message: "Your submission for 'Data Structures Assignment' has been graded. Grade: 8.5/10",
    timestamp: "2024-01-09T14:15:00Z",
    read: false,
    grade: 8.5,
  },
  {
    id: 3,
    type: "deadline_reminder",
    title: "Assignment Due Soon",
    message: "Reminder: 'Web Development Project' is due in 2 days",
    timestamp: "2024-01-08T09:00:00Z",
    read: true,
    assignment: "Web Development Project",
  },
  {
    id: 4,
    type: "feedback_available",
    title: "Feedback Available",
    message: "Prof. Johnson has provided feedback on your 'Database Design' submission",
    timestamp: "2024-01-07T16:45:00Z",
    read: true,
    assignment: "Database Design",
  },
  {
    id: 5,
    type: "new_assignment",
    title: "New Assignment Posted",
    message: "Prof. Davis has posted a new assignment: 'Machine Learning Project'",
    timestamp: "2024-01-06T11:20:00Z",
    read: true,
    assignment: "Machine Learning Project",
  },
]

export default function StudentNotifications() {
  const [notifications, setNotifications] = useState(mockNotifications)

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "new_assignment":
        return <FileText className="h-5 w-5 text-blue-600" />
      case "grade_received":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "deadline_reminder":
        return <Clock className="h-5 w-5 text-yellow-600" />
      case "feedback_available":
        return <Bell className="h-5 w-5 text-purple-600" />
      default:
        return <Bell className="h-5 w-5 text-gray-600" />
    }
  }

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case "new_assignment":
        return <Badge className="bg-blue-100 text-blue-800">New Assignment</Badge>
      case "grade_received":
        return <Badge className="bg-green-100 text-green-800">Grade</Badge>
      case "deadline_reminder":
        return <Badge className="bg-yellow-100 text-yellow-800">Reminder</Badge>
      case "feedback_available":
        return <Badge className="bg-purple-100 text-purple-800">Feedback</Badge>
      default:
        return <Badge variant="secondary">Notification</Badge>
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays} days ago`
    }
  }

  const markAsRead = (id: number) => {
    setNotifications(notifications.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((notif) => notif.id !== id))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })))
  }

  const unreadCount = notifications.filter((notif) => !notif.read).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">
            Stay updated with your assignments and grades
            {unreadCount > 0 && <Badge className="ml-2 bg-red-100 text-red-800">{unreadCount} unread</Badge>}
          </p>
        </div>

        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bell className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-600 text-center">You're all caught up! New notifications will appear here.</p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`${!notification.read ? "border-blue-200 bg-blue-50" : ""} hover:shadow-md transition-shadow`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-base">{notification.title}</CardTitle>
                        {!notification.read && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                      </div>
                      {getNotificationBadge(notification.type)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{formatTimestamp(notification.timestamp)}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-gray-700 mb-3">{notification.message}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {notification.assignment && (
                      <span className="text-sm text-gray-600">Assignment: {notification.assignment}</span>
                    )}
                    {notification.grade && (
                      <span className="text-sm font-medium text-green-600">Grade: {notification.grade}/10</span>
                    )}
                  </div>

                  {!notification.read && (
                    <Button variant="outline" size="sm" onClick={() => markAsRead(notification.id)}>
                      Mark as Read
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
