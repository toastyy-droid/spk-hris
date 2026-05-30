"use client"

import { type ReactNode } from "react"
import { ThemeProvider } from "next-themes"
import { AuthProvider } from "@/contexts/auth-context"
import { NotificationProvider } from "@/contexts/notification-context"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <NotificationProvider>{children}</NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
