"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Building2 } from "lucide-react"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")
    setSubmitting(true)
    try {
      await login({ username, password })
      router.push("/")
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login gagal"
      setError(message.toLowerCase().includes("failed to fetch") ? "Server belum siap. Coba lagi sebentar." : message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-accent/10 blur-3xl" />
      <div className="relative w-full max-w-sm animate-fade-in">
        <div className="text-center mb-8 space-y-2 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25">
              <Building2 className="h-7 w-7 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Supplier Terbaik</h1>
          <p className="text-sm text-muted-foreground">Pemilihan Supplier Terbaik</p>
        </div>
        <div className="rounded-2xl bg-card/80 backdrop-blur-sm shadow-card p-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-xl bg-destructive/10 p-3.5 text-sm text-destructive border border-destructive/20 animate-fade-in">
                {error}
              </div>
            )}
            <div className="space-y-2.5">
              <Label htmlFor="username" className="text-sm font-medium">Username</Label>
              <Input
                id="username"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="h-11 rounded-xl border-subtle bg-background/50 focus:bg-background transition-all"
              />
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 rounded-xl border-subtle bg-background/50 focus:bg-background transition-all"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-11 rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 text-[15px]"
              disabled={submitting}
            >
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Masuk
            </Button>
          </form>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-8 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          &copy; {new Date().getFullYear()} Supplier Terbaik &mdash; Evaluasi dan Ranking
        </p>
      </div>
    </div>
  )
}
