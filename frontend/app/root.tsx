import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
} from "react-router"

import type { Route } from "./+types/root"
import { Button } from "@components/button"
import "@styles/globals.css"
import { useAuth } from "./hooks/useAuth"

export function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { isAuthenticated, logout } = useAuth()

  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-svh bg-background text-foreground antialiased">
        <div className="relative min-h-svh overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -left-48 top-[-14rem] h-[36rem] w-[36rem] rounded-full bg-cyan-400/25 blur-[150px]" />
            <div className="absolute right-[-12rem] top-[-6rem] h-[30rem] w-[30rem] rounded-full bg-fuchsia-500/20 blur-[120px]" />
            <div className="absolute bottom-[-12rem] left-1/3 h-[30rem] w-[30rem] rounded-full bg-emerald-400/20 blur-[160px]" />
            <div className="absolute inset-x-0 top-0 h-52 bg-gradient-to-b from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.08),_transparent_55%)]" />
            <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:100%_24px]" />
          </div>

          <header className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
            <div className="flex items-center gap-3">
              <span className="inline-flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 via-fuchsia-500 to-emerald-400 text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-black shadow-[0_0_30px_rgba(34,211,238,0.55)]">
                MQ
              </span>
              <div className="leading-tight">
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">
                  
                </p>
                <p className="text-lg font-semibold">Music Quizzer</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
                <Link to="/">Home</Link>
                <Link to="/quiz">Quiz</Link>
                <Link to="/settings">Settings</Link>
              </nav>
              <div className="flex items-center gap-2">
                {isAuthenticated ? (
                  <Button size="sm" variant="outline" onClick={logout}>
                    Log out
                  </Button>
                ) : (
                  <>
                    <Button asChild size="sm" variant="ghost">
                      <Link to="/login">Log in</Link>
                    </Button>
                    <Button asChild size="sm">
                      <Link to="/register">Register</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </header>

          <main className="relative mx-auto w-full max-w-6xl px-6 pb-16">
            {children}
          </main>

          <footer className="relative mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-3 border-t border-border/40 px-6 py-8 text-sm text-muted-foreground md:flex-row md:items-center">
            <p>Built for midnight basslines and neon speed rounds.</p>
            <p>Neon Club Quiz · 2026</p>
          </footer>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!"
  let details = "An unexpected error occurred."
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error"
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}
