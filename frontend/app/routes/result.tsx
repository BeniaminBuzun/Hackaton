import { useEffect, useState } from "react"
import { Link, useLocation, useParams } from "react-router"
import { Button } from "@components/button"
import { useRequireAuth } from "../hooks/useRequireAuth"
import axios from "axios"
import { getUserId } from "@/lib/authStore"

const DEFAULT_API_BASE_URL = "http://localhost:8081"
const API_BASE_URL =
  (import.meta as ImportMeta).env?.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL

interface QuestionSummaryDTO {
  question: string
  title: string
  answer: string
  correctAnswer: string
  points: number
}

interface ApiResponse {
  summary: QuestionSummaryDTO[]
}

export default function ResultRoute() {
  const { isAuthenticated } = useRequireAuth()
  const location = useLocation()
  const data = location.state
  const effectiveQuizId = data.quizId
  const userId = getUserId()

  const [quizResults, setQuizResults] = useState<QuestionSummaryDTO[] | null>(
    null
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) return

    const fetchResults = async () => {
      console.log("ids")
      console.log(effectiveQuizId)
      console.log(userId)
      setLoading(true)
      setError(null)
      try {
        const url = new URL(
          `/api/quizes/${effectiveQuizId}/results/${userId}`,
          API_BASE_URL
        ).toString()
        const response = await axios.get<ApiResponse>(url)

        // ✅ Extract the summary array
        const summaryData = response.data.summary
        console.log("Fetched summary:", summaryData)

        setQuizResults(summaryData)
      } catch (err) {
        console.error("Fetch error:", err)
        setError("Failed to load quiz results.")
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [effectiveQuizId, isAuthenticated])

  // Authentication guard
  if (!isAuthenticated) return null

  // Loading state
  if (loading) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-4xl items-center justify-center">
        <div className="text-center text-white/70">Loading your results...</div>
      </div>
    )
  }

  // Error or no data state
  if (error) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-4xl flex-col items-center justify-center gap-4">
        <div className="text-center text-red-400">{error}</div>
        <Button asChild variant="outline" size="lg">
          <Link to={`/settings`}>Try again</Link>
        </Button>
      </div>
    )
  }

  // No results (empty array or null)
  if (!quizResults || quizResults.length === 0) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-4xl flex-col items-center justify-center gap-4">
        <div className="text-center text-white/70">
          No results found for this quiz.
        </div>
        <Button asChild variant="outline" size="lg">
          <Link to={`/settings`}>Take a quiz</Link>
        </Button>
      </div>
    )
  }

  // Calculate totals
  const totalPossiblePoints = quizResults.reduce((sum, q) => sum + q.points, 0)
  const earnedPoints = quizResults.reduce(
    (sum, q) => sum + (q.answer === q.correctAnswer ? q.points : 0),
    0
  )
  const percent =
    totalPossiblePoints > 0
      ? Math.round((earnedPoints / totalPossiblePoints) * 100)
      : 0

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-4xl flex-col gap-10 pt-6">
      {/* Score Summary Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-black/90 via-slate-950/80 to-black/90 px-8 py-12 shadow-[0_0_60px_rgba(34,211,238,0.25)]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-10 right-10 h-28 w-28 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute bottom-6 left-16 h-24 w-24 rounded-full bg-fuchsia-500/20 blur-2xl" />
          <div className="absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/15 blur-[90px]" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-6 text-center">
          <p className="text-xs font-semibold tracking-[0.4em] text-white/50 uppercase">
            Final score
          </p>
          <h1 className="text-3xl font-semibold text-white md:text-5xl">
            {earnedPoints} / {totalPossiblePoints} points
          </h1>
          <p className="text-base text-white/70">
            You earned {percent}% of available points. Ready for another round?
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="h-11 px-6 text-base">
              <Link to={`/settings`}>Play again</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-11 px-6 text-base"
            >
              <Link to="/">Back home</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Answers Breakdown Section */}
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="mb-4 text-xl font-semibold text-white">
          Question-by-question results
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quizResults.map((item, index) => {
            const isCorrect = item.answer === item.correctAnswer
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl border border-white/10 bg-black/40 p-4 transition-all hover:border-white/20"
              >
                {isCorrect && (
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
                )}

                <div className="relative z-10 flex items-start gap-3">
                  <div className="mt-0.5 flex-shrink-0">
                    {isCorrect ? (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    ) : (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/20 text-red-400">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3
                      className="truncate font-semibold text-white"
                      title={item.question}
                    >
                      {item.question}
                    </h3>
                    {item.title && (
                      <p className="mt-0.5 text-xs text-white/50">
                        {item.title}
                      </p>
                    )}
                    <div className="mt-2 space-y-1 text-sm">
                      <p className="text-white/60">
                        <span className="text-white/40">Correct answer:</span>{" "}
                        {item.correctAnswer}
                      </p>
                      <p className="text-white/60">
                        <span className="text-white/40">Your answer:</span>{" "}
                        <span
                          className={
                            isCorrect ? "text-emerald-400" : "text-red-400"
                          }
                        >
                          {item.answer || "(no answer)"}
                        </span>
                      </p>
                      <p className="text-white/60">
                        <span className="text-white/40">Points:</span>{" "}
                        {item.points}
                        {!isCorrect && (
                          <span className="ml-1 text-white/40">
                            (not earned)
                          </span>
                        )}
                      </p>
                    </div>
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
