"use client"

import type React from "react"

import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar role="teacher" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Teacher Dashboard" />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
