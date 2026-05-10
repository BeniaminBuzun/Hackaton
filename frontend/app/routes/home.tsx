import { Link, useNavigate } from "react-router"

import { Button } from "@components/button"
import axios from "axios"
import { getUserId } from "@/lib/authStore"
import { useAuth } from "@/hooks/useAuth"
import { useEffect, useState } from "react"

const DEFAULT_API_BASE_URL = "http://localhost:8081"
const API_BASE_URL =
  (import.meta as ImportMeta).env?.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL

export default function Home() {
  // Placeholder variables for scores
  const { isAuthenticated } = useAuth()
  const userId = getUserId()
  const [accuracyPercent, setAccuracyPercent] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated || !userId) return

    const fetchStats = async () => {
      try {
        const response = await axios.get(
          new URL(`/api/stats/${userId}`, API_BASE_URL).toString()
        )
        setAccuracyPercent(response.data.accuracyPercent)
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [isAuthenticated, userId])

  const bottomStats = ["Daily Challenges", "Global Ranking", "10-Day Streak"]
  const navigate = useNavigate()
  async function sendQuizRequest() {
    if (!isAuthenticated) {
      navigate("/login", {
        replace: true,
        state: { from: location.pathname },
      })
      return
    }
    const url = new URL("/api/quizes", API_BASE_URL).toString()
    const body = {
      options: {
        GENRE: true,
        ARTISTS: false,
        SONG_NAME: false,
        TIME_PERIOD: false,
      },
      retake: false,
      userId: userId,
    }
    console.log(body)
    try {
      const response = await axios.post(url, body, {
        headers: { "Content-Type": "application/json" },
      })
      console.log("Response:", response.data)
      navigate("/quiz2", { state: response.data })
    } catch (error) {
      console.error("Error:", error)
    }
  }

  return (
    <div className="flex min-h-[70vh] flex-col gap-14 pt-6">
      <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-black/90 via-slate-950/80 to-black/90 p-8 shadow-[0_0_60px_rgba(34,211,238,0.25)] md:p-12">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-10 right-10 h-32 w-32 rounded-full bg-cyan-400/25 blur-3xl" />
          <div className="absolute bottom-6 left-12 h-28 w-28 rounded-full bg-fuchsia-500/25 blur-2xl" />
          <div className="absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/20 blur-[90px]" />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-cyan-400/10 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 grid gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div className="flex flex-col gap-6">
            <div className="space-y-4">
              <h1 className="text-3xl leading-tight font-semibold text-white md:text-5xl">
                🎵 Music Guesser
              </h1>
              <p className="max-w-xl text-base text-white/70 md:text-lg">
                Guess the song from short clips, test your music knowledge, and
                compete daily. Compare your scores from the last 10 days and
                climb the global leaderboard.
              </p>
            </div>
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Button
                onClick={sendQuizRequest}
                size="lg"
                className="h-11 px-6 text-base"
              >
                Quick Game
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-11 px-6 text-base"
              >
                <Link to="/settings">New Custom Game</Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-11 px-6 text-base"
              >
                <Link to="/leaderboard">View leaderboard</Link>
              </Button>
              {/* <span className="text-sm text-white/50">
                Join the challenge
              </span> */}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold tracking-[0.3em] text-white/60 uppercase">
                  Your score
                </p>
              </div>
              <div className="mt-6 space-y-4 text-sm text-white/80">
                {loading ? (
                  <div className="text-center text-white/70">
                    Loading stats...
                  </div>
                ) : accuracyPercent !== null ? (
                  <div className="flex items-center justify-between">
                    <span>Accuracy</span>
                    <span className="font-mono font-semibold text-cyan-200">
                      {Math.round(accuracyPercent)}%
                    </span>
                  </div>
                ) : (
                  <div className="text-center text-white/70">
                    No stats available
                  </div>
                )}
              </div>
              {accuracyPercent !== null && (
                <div className="mt-6 space-y-2">
                  <div className="h-1.5 w-full rounded-full bg-white/10">
                    <div
                      className="h-1.5 rounded-full bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-emerald-300"
                      style={{ width: `${accuracyPercent}%` }}
                    />
                  </div>
                  <p className="text-right text-xs text-white/40">
                    accuracy {Math.round(accuracyPercent)}%
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {bottomStats.map((item) => (
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
