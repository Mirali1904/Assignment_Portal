"use client"

import { useState, useEffect } from "react"
import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface HeaderProps {
  title: string
}

export function Header({ title }: HeaderProps) {
  const [userName, setUserName] = useState("")
  const [notificationCount] = useState(3) // Mock notification count

  useEffect(() => {
    setUserName(localStorage.getItem("userName") || "User")
  }, [])

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search..." className="pl-10 w-64" />
        </div>

        {/* Notifications */}
        <div className="relative">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {notificationCount}
              </Badge>
            )}
          </Button>
        </div>

        {/* User Avatar */}
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-blue-100 text-blue-600">{userName.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
