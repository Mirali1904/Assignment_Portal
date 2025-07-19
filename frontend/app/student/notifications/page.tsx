"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, FileText, CheckCircle, Clock, Trash2 } from "lucide-react"

type Notification = {
  _id: string
  type: "new_assignment" | "grade_received" | "deadline_reminder" | "feedback_available"
  title?: string
  message: string
  read: boolean
  createdAt: string
  assignment?: string
}




export default function StudentNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    const fetchNotifications = async () => {
      const email = localStorage.getItem("userEmail")
      const res = await fetch(`http://localhost:5000/api/notifications?email=${email}`)
      const data = await res.json()
      if (res.ok) setNotifications(data.data)
      else console.error(data.message)
      console.log("Fetched notifications:", data.data);
    }

    fetchNotifications()
  }, [])

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

  const markAsRead = async (id: string) => {
    await fetch(`http://localhost:5000/api/notifications/${id}/mark-read`, {
      method: "PATCH",
    })
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    )
  }

  const deleteNotification = async (id: string) => {
    await fetch(`http://localhost:5000/api/notifications/${id}`, {
      method: "DELETE",
    });

    setNotifications((prev) => prev.filter((notif) => notif._id !== id));
  };


  const markAllAsRead = async () => {
    try {
      const email = localStorage.getItem("userEmail");
      const res = await fetch(`http://localhost:5000/api/notifications/mark-all-read?email=${email}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        setNotifications((prev) =>
          prev.map((notif) => ({ ...notif, read: true }))
        );
      } else {
        const errData = await res.json();
        console.error("API error:", errData.message);
      }
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };



  const unreadCount = notifications.filter((notif) => !notif.read).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">
            Stay updated with your assignments and grades
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-red-100 text-red-800">{unreadCount} unread</Badge>
            )}
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
              key={notification._id}
              className={`${!notification.read ? "border-blue-200 bg-blue-50" : ""} hover:shadow-md transition-shadow`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-base">{notification.message}</CardTitle>
                        {!notification.read && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                      </div>
                      {getNotificationBadge(notification.type)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {formatTimestamp(notification.createdAt)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => deleteNotification(notification._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">


                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {notification.assignment && (
                      <span className="text-sm text-gray-600">
                      </span>
                    )}

                  </div>

                  {!notification.read && (
                    <Button variant="outline" size="sm" onClick={() => markAsRead(notification._id)}>
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
