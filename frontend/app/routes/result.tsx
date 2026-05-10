import { Link, useLocation } from "react-router"
import { Button } from "@components/button"
import { getLatestResult } from "../lib/quizSessionStore"
import { useRequireAuth } from "../hooks/useRequireAuth"

const DEFAULT_QUIZ_ID = "neon-club"

type AnswerItem = {
  music_title: string
  anwser_correct: string
  anwser_wrong: string
  url: string
}

type QuizResultData = {
  total_anwsers: number
  correct_anwsers: number
  anwsers: AnswerItem[]
}

type LocationState = {
  result?: QuizResultData
}

// Placeholder / mock result data for demo/preview purposes
const PLACEHOLDER_RESULT: QuizResultData = {
  total_anwsers: 5,
  correct_anwsers: 3,
  anwsers: [
    {
      music_title: "Midnight Dreams",
      anwser_correct: "The Weeknd",
      anwser_wrong: "Drake",
      url: "https://example.com/track1"
    },
    {
      music_title: "Electric Feel",
      anwser_correct: "MGMT",
      anwser_wrong: "MGMT",
      url: "https://example.com/track2"
    },
    {
      music_title: "Neon Lights",
      anwser_correct: "Lana Del Rey",
      anwser_wrong: "Lorde",
      url: "https://example.com/track3"
    },
    {
      music_title: "Digital Love",
      anwser_correct: "Daft Punk",
      anwser_wrong: "Daft Punk",
      url: "https://example.com/track4"
    },
    {
      music_title: "Running Up That Hill",
      anwser_correct: "Kate Bush",
      anwser_wrong: "Placebo",
      url: "https://example.com/track5"
    }
  ]
}

export default function ResultRoute() {
  const { isAuthenticated } = useRequireAuth()
  const location = useLocation()
  const locationState = location.state as LocationState | null
  const realResult = locationState?.result ?? getLatestResult() as QuizResultData | null

  if (!isAuthenticated) {
    return null
  }
  
  // Use placeholder if no real result exists
  const result = realResult ?? PLACEHOLDER_RESULT
  const isPlaceholder = !realResult

  const { total_anwsers, correct_anwsers, anwsers } = result
  const percent = total_anwsers > 0 ? Math.round((correct_anwsers / total_anwsers) * 100) : 0

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-4xl flex-col gap-10 pt-6">
      {/* Score Summary Section */}
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
            {correct_anwsers} / {total_anwsers} tracks locked
          </h1>
          <p className="text-base text-white/70">
            You matched {percent}% of the set. Ready for another round?
          </p>

          {/* Placeholder badge */}
          {isPlaceholder && (
            <div className="mt-2 inline-flex items-center rounded-full bg-amber-500/20 px-3 py-1 text-xs font-medium text-amber-300 backdrop-blur-sm">
              ⚡ Demo preview – start a quiz to see your real results
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="h-11 px-6 text-base">
              <Link to={`/quiz/${DEFAULT_QUIZ_ID}`}>Play again</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-11 px-6 text-base">
              <Link to="/">Back home</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Answers Breakdown Section */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-4 text-xl font-semibold text-white">
          Track-by-track results
          {isPlaceholder && (
            <span className="ml-2 text-sm font-normal text-white/40">(demo data)</span>
          )}
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {anwsers.map((answer, index) => {
            const isCorrect = answer.anwser_wrong === answer.anwser_correct
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl border border-white/10 bg-black/40 p-4 transition-all hover:border-white/20"
              >
                {isCorrect && (
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
                
                <div className="relative z-10 flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {isCorrect ? (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20 text-red-400">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate" title={answer.music_title}>
                      {answer.music_title}
                    </h3>
                    <div className="mt-2 space-y-1 text-sm">
                      <p className="text-white/60">
                        <span className="text-white/40">Correct:</span> {answer.anwser_correct}
                      </p>
                      <p className="text-white/60">
                        <span className="text-white/40">Your answer:</span>{' '}
                        <span className={isCorrect ? 'text-emerald-400' : 'text-red-400'}>
                          {answer.anwser_wrong || '(no answer)'}
                        </span>
                      </p>
                    </div>
                    {answer.url && (
                      <a
                        href={answer.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-xs text-white/40 hover:text-cyan-400 transition-colors"
                      >
                        ℹ️ Track info
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}