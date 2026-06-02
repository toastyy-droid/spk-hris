"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { api, getToken, setToken } from "@/lib/api"

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
const AUTH_RETRY_ATTEMPTS = 8
const AUTH_RETRY_DELAY_MS = 750

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function isRetryableAuthError(error: unknown) {
  if (!(error instanceof Error)) return false
  const message = error.message.toLowerCase()
  return message.includes("failed to fetch") || message.includes("network") || message.includes("abort")
}

async function retryAuthRequest<T>(request: () => Promise<T>, attempts = AUTH_RETRY_ATTEMPTS): Promise<T> {
  let lastError: unknown

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await request()
    } catch (error) {
      lastError = error
      if (!isRetryableAuthError(error) || attempt === attempts) break
      await wait(AUTH_RETRY_DELAY_MS)
    }
  }

  throw lastError
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async () => {
    try {
      const data = await retryAuthRequest(() =>
        api.get<{ id: number; username: string; role: string; employee: { id: number; name: string } | null }>("/auth/profile")
      )
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
    const token = getToken()
    if (token) {
      fetchProfile().finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [fetchProfile])

  const login = useCallback(async (payload: LoginPayload) => {
    const data = await retryAuthRequest(() => api.post<{ accessToken: string; user: User }>("/auth/login", payload))
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
