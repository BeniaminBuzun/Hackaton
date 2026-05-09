import { Link, useLocation } from "react-router"

import { Button } from "@workspace/ui/components/button"

import { getLatestResult } from "../lib/quizSessionStore"
import type { QuizResult } from "../lib/quizClient"

const DEFAULT_QUIZ_ID = "neon-club"

type LocationState = {
  result?: QuizResult
}

export default function ResultRoute() {
  const location = useLocation()
  const locationState = location.state as LocationState | null
  const result = locationState?.result ?? getLatestResult()

  if (!result) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-4xl flex-col gap-10 pt-6">
        <section className="rounded-[2.5rem] border border-white/10 bg-white/5 px-8 py-12 text-center shadow-[0_0_60px_rgba(34,211,238,0.15)]">
          <h1 className="text-2xl font-semibold text-white md:text-4xl">
            No results yet
          </h1>
          <p className="mt-4 text-base text-white/70">
            Start a fresh run to see your score.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link to={`/quiz/${DEFAULT_QUIZ_ID}`}>Start the quiz</Link>
          </Button>
        </section>
      </div>
    )
  }

  const percent = result.total > 0 ? Math.round((result.correct / result.total) * 100) : 0

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-4xl flex-col gap-10 pt-6">
      <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-black/90 via-slate-950/80 to-black/90 px-8 py-12 shadow-[0_0_60px_rgba(34,211,238,0.25)]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-10 top-10 h-28 w-28 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute bottom-6 left-16 h-24 w-24 rounded-full bg-fuchsia-500/20 blur-2xl" />
          <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/15 blur-[90px]" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/50">
            Final score
          </p>
          <h1 className="text-3xl font-semibold text-white md:text-5xl">
            {result.correct} / {result.total} tracks locked
          </h1>
          <p className="text-base text-white/70">
            You matched {percent}% of the set. Ready for another round?
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="h-11 px-6 text-base">
              <Link to={`/quiz/${result.quizId ?? DEFAULT_QUIZ_ID}`}>Play again</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-11 px-6 text-base">
              <Link to="/">Back home</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {["Streaming answers", "Results computed", "Ready for backend"].map((item) => (
          <div
            key={item}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white/70"
          >
            <span className="font-semibold text-white/80">{item}</span>
            <span className="h-2 w-2 rounded-full bg-gradient-to-r from-fuchsia-400 to-cyan-400" />
          </div>
        ))}
      </section>
    </div>
  )
}
