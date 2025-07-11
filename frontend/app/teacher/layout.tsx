"use client"

import { ReactNode } from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"

type TeacherLayoutProps = {
  children: ReactNode
}

export default function TeacherLayout({ children }: TeacherLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for teacher role */}
      <Sidebar role="teacher" />

      {/* Main content layout */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title="Teacher Dashboard" />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}