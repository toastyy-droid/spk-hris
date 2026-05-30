"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { api, setToken } from "@/lib/api"

interface User {
  id: number
  username: string
  role: string
  employeeId: number | null
  employeeName: string | null
}

interface LoginPayload {
  username: string
  password: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (payload: LoginPayload) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async () => {
    try {
      const data = await api.get<{ id: number; username: string; role: string; employee: { id: number; name: string } | null }>("/auth/profile")
      setUser({
        id: data.id,
        username: data.username,
        role: data.role,
        employeeId: data.employee?.id ?? null,
        employeeName: data.employee?.name ?? null,
      })
    } catch {
      setToken(null)
      setUser(null)
    }
  }, [])

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (token) {
      fetchProfile().finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [fetchProfile])

  const login = useCallback(async (payload: LoginPayload) => {
    const data = await api.post<{ accessToken: string; user: User }>("/auth/login", payload)
    setToken(data.accessToken)
    setUser(data.user)
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider")
  return ctx
}
