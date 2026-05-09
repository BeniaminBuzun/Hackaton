import { useEffect } from "react"
import { useNavigate, useParams } from "react-router"

import { Button } from "@components/button"

import { useQuizFlow } from "../hooks/useQuizFlow"
import { setLatestResult } from "../lib/quizSessionStore"

const DEFAULT_QUIZ_ID = "neon-club"

export default function QuizRoute() {
  const params = useParams()
  const quizId = params.quizId ?? DEFAULT_QUIZ_ID
  const navigate = useNavigate()

  const { status, question, progress, error, result, start, submitAnswer } =
    useQuizFlow(quizId)

  useEffect(() => {
    start()
  }, [start])

  useEffect(() => {
    if (status !== "done" || !result) {
      return
    }

    setLatestResult(result)
    navigate("/result", { state: { result } })
  }, [navigate, result, status])

  const isBusy = status === "loading" || status === "answering"
  const totalLabel = progress.total > 0 ? progress.total : "--"
  const progressPercent =
    progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-4xl flex-col gap-10 pt-6">
      <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-black/90 via-slate-950/80 to-black/90 p-8 shadow-[0_0_60px_rgba(34,211,238,0.25)] md:p-12">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-10 top-10 h-28 w-28 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute bottom-6 left-16 h-24 w-24 rounded-full bg-fuchsia-500/20 blur-2xl" />
          <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/15 blur-[90px]" />
        </div>

        <div className="relative z-10 flex flex-col gap-8">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/50">
                Pulse Quiz
              </p>
              <h1 className="text-2xl font-semibold text-white md:text-4xl">
                Lock the vibe
              </h1>
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white/70">
              Question {progress.current || "--"} / {totalLabel}
            </div>
          </header>

          <div>
            <div className="h-1.5 w-full rounded-full bg-white/10">
              <div
                className="h-1.5 rounded-full bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-emerald-300 transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {status === "loading" && (
            <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-10 text-center text-sm text-white/60">
              Loading the next drop...
            </div>
          )}

          {status === "error" && (
            <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-6 py-8 text-sm text-rose-100">
              <p className="font-semibold">{error ?? "Something went wrong."}</p>
              <Button
                size="sm"
                className="mt-4"
                onClick={() => start()}
              >
                Try again
              </Button>
            </div>
          )}

          {question && status !== "loading" && status !== "error" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-8">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
                  Now playing
                </p>
                <h2 className="mt-3 text-xl font-semibold text-white md:text-2xl">
                  {question.text}
                </h2>
              </div>

              <div className="grid gap-4">
                {question.choices.map((choice) => (
                  <Button
                    key={choice.id}
                    variant="outline"
                    size="lg"
                    className="h-auto justify-start gap-4 rounded-2xl border-white/15 bg-white/5 px-6 py-5 text-left text-base text-white hover:border-cyan-300/50 hover:bg-cyan-400/10"
                    onClick={() => submitAnswer(choice.id)}
                    disabled={isBusy}
                  >
                    <span className="flex size-10 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-sm font-semibold text-white/80">
                      {choice.label}
                    </span>
                    <span className="flex-1 text-white/80">{choice.text}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {["No timer", "Auto-advance", "Streaming answers"].map((item) => (
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
