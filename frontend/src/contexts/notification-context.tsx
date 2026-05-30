"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export interface Notification {
  id: string
  title: string
  message: string
  timestamp: Date
  read: boolean
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  pushNotification: (title: string, message: string) => void
  markAsRead: (id: string) => void
  markAllRead: () => void
  clearAll: () => void
}

const NotificationContext = createContext<NotificationContextType | null>(null)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const pushNotification = useCallback((title: string, message: string) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 6)
    setNotifications((prev) => [{ id, title, message, timestamp: new Date(), read: false }, ...prev].slice(0, 50))
  }, [])

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }, [])

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, pushNotification, markAsRead, markAllRead, clearAll }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider")
  return ctx
}
