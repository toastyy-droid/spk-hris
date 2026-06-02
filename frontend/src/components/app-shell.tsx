"use client"

import { type ReactNode, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import { useAuth } from "@/contexts/auth-context"

const publicRoutes = ["/login"]

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading } = useAuth()
  const isPublicRoute = publicRoutes.includes(pathname)

  useEffect(() => {
    if (loading) return

    if (!user && !isPublicRoute) {
      router.replace("/login")
      return
    }

    if (user && isPublicRoute) {
      router.replace("/")
    }
  }, [isPublicRoute, loading, router, user])

  if (loading || !user) {
    if (isPublicRoute && !loading) return <>{children}</>

    return (
      <div className="flex h-screen flex-col items-center justify-center gap-2 bg-background text-sm text-muted-foreground">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p>Menyiapkan sesi login...</p>
      </div>
    )
  }

  if (isPublicRoute) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-2 bg-background text-sm text-muted-foreground">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p>Mengarahkan ke dashboard...</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
