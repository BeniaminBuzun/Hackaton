import { useEffect, useMemo, useState } from "react"
import type { SyntheticEvent } from "react"
import { Link, useLocation, useNavigate } from "react-router"

import { Button } from "@components/button"

import { useAuth } from "../hooks/useAuth"
import { login } from "../lib/authClient"
import { setUserId } from "../lib/authStore"

type LocationState = {
  from?: string
}

export default function LoginRoute() {
  const navigate = useNavigate()
  const location = useLocation() as { state?: LocationState }
  const { isAuthenticated } = useAuth()

  const [nick, setNick] = useState("")
  const [password, setPassword] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle")
  const [error, setError] = useState<string | null>(null)

  const redirectTo = useMemo(
    () => location.state?.from ?? "/",
    [location.state?.from]
  )

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true })
    }
  }, [isAuthenticated, navigate, redirectTo])

  const canSubmit = nick.trim().length > 0 && password.length > 0
  const isBusy = status === "loading"

  const submit = async () => {
    if (!canSubmit) {
      setStatus("error")
      setError("Please enter a nick and password")
      return
    }

    setStatus("loading")
    setError(null)

    try {
      const response = await login({ nick: nick.trim(), password })
      setUserId(response.userId)
      setStatus("idle")
      navigate(redirectTo, { replace: true })
    } catch (error_) {
      setStatus("error")
      setError(error_ instanceof Error ? error_.message : "Login failed")
    }
  }

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    void submit()
  }

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-4xl flex-col gap-10 pt-6">
      <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-black/90 via-slate-950/80 to-black/90 px-8 py-12 text-center shadow-[0_0_60px_rgba(34,211,238,0.25)]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-10 top-10 h-28 w-28 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute bottom-6 left-16 h-24 w-24 rounded-full bg-fuchsia-500/20 blur-2xl" />
          <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/15 blur-[90px]" />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-semibold text-white md:text-5xl">
            Welcome back
          </h1>
          <p className="mt-3 text-sm font-semibold uppercase tracking-[0.3em] text-white/50">
            Log in to start the next round
          </p>
        </div>
      </section>

      <section className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8 shadow-[0_0_60px_rgba(34,211,238,0.15)]">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="login-nick"
              className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400"
            >
              Nick
            </label>
            <input
              id="login-nick"
              type="text"
              value={nick}
              onChange={(event) => setNick(event.target.value)}
              autoComplete="username"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition-all focus:border-cyan-400/50 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)]"
              placeholder="NeonRunner"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="login-password"
              className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400"
            >
              Password
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition-all focus:border-cyan-400/50 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)]"
              placeholder="••••••••"
            />
          </div>

          {status === "error" && error && (
            <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {error}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" size="lg" className="h-11 px-6" disabled={!canSubmit || isBusy}>
              {isBusy ? "Signing in..." : "Log in"}
            </Button>
            <Button asChild variant="outline" size="lg" className="h-11 px-6">
              <Link to="/register">Create account</Link>
            </Button>
          </div>

          <p className="text-xs text-white/50">
            Need a fresh profile? <Link to="/register" className="text-cyan-300">Register here</Link>.
          </p>
        </form>
      </section>
    </div>
  )
}
