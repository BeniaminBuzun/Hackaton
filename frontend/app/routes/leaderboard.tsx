import { useMemo } from "react"
import { Link } from "react-router"

import { Button } from "@components/button"

import { useRequireAuth } from "../hooks/useRequireAuth"
import { useRanking } from "../hooks/useRanking"
import type { RankingType } from "../lib/rankingClient"

const rankingOptions: Array<{ value: RankingType; label: string; helper: string }> = [
  { value: "general", label: "General", helper: "All-time club energy" },
  { value: "genre", label: "Genre", helper: "Top scores by genre" },
  { value: "author", label: "Author", helper: "Producers and creators" },
]

const buildPageWindow = (current: number, total: number, maxVisible = 7) => {
  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, index) => index + 1)
  }

  const half = Math.floor(maxVisible / 2)
  const start = Math.max(1, Math.min(current - half, total - maxVisible + 1))
  return Array.from({ length: maxVisible }, (_, index) => start + index)
}

export default function LeaderboardRoute() {
  const { isAuthenticated } = useRequireAuth()
  if (!isAuthenticated) {
    return null
  }

  return <LeaderboardContent />
}

function LeaderboardContent() {
  const { status, data, error, type, page, pageSize, setType, setPage, refresh } =
    useRanking({ pageSize: 12 })

  const totalPages = data?.totalPages ?? 1
  const pageWindow = useMemo(
    () => buildPageWindow(page, totalPages),
    [page, totalPages]
  )

  const currentType = rankingOptions.find((option) => option.value === type)

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-5xl flex-col gap-10 pt-6">
      <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-black/90 via-slate-950/80 to-black/90 px-8 py-12 shadow-[0_0_60px_rgba(34,211,238,0.25)]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-10 top-10 h-28 w-28 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute bottom-6 left-16 h-24 w-24 rounded-full bg-fuchsia-500/20 blur-2xl" />
          <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/15 blur-[90px]" />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-cyan-400/10 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/50">
              Live leaderboard
            </p>
            <h1 className="text-3xl font-semibold text-white md:text-5xl">
              Neon rankings, zero latency.
            </h1>
            <p className="max-w-2xl text-base text-white/70 md:text-lg">
              Track the best runs across the club, switch the lens, and
              re-sync with the latest scores.
            </p>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Ranking type</p>
              <p className="text-xs text-white/50">
                {currentType?.helper ?? "Choose a leaderboard"}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <select
                  className="h-11 rounded-full border border-white/15 bg-black/50 px-4 pr-10 text-sm font-semibold text-white shadow-[0_0_30px_rgba(34,211,238,0.15)] focus:outline-none"
                  value={type}
                  onChange={(event) => setType(event.target.value as RankingType)}
                >
                  {rankingOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <Button variant="outline" size="sm" className="h-11 px-4" onClick={refresh}>
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[2.5rem] border border-white/10 bg-white/5 p-6 shadow-[0_0_40px_rgba(148,163,184,0.12)]">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 text-xs font-semibold uppercase tracking-[0.4em] text-white/40">
          <span>Position</span>
          <span className="ml-auto mr-[32%]">Player</span>
          <span>Score</span>
        </div>

        {status === "loading" && (
          <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 text-center">
            <div className="h-10 w-10 animate-pulse rounded-full bg-cyan-400/30" />
            <p className="text-sm font-semibold text-white">Syncing leaderboard</p>
            <p className="text-xs text-white/50">Pulling the latest drops.</p>
          </div>
        )}

        {status === "error" && (
          <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 text-center">
            <p className="text-sm font-semibold text-white">Unable to load rankings</p>
            <p className="text-xs text-white/50">{error}</p>
            <Button variant="outline" size="sm" onClick={refresh}>
              Try again
            </Button>
          </div>
        )}

        {status === "ready" && data?.items.length === 0 && (
          <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 text-center">
            <p className="text-sm font-semibold text-white">No scores yet</p>
            <p className="text-xs text-white/50">Be the first to light up this ranking.</p>
          </div>
        )}

        {status === "ready" && data?.items.length ? (
          <div className="mt-4 space-y-3">
            {data.items.map((entry) => (
              <div
                key={`${entry.position}-${entry.name}`}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white/80"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white">
                    {entry.position}
                  </span>
                  <div className="flex flex-col">
                    <Link
                      to={`/users/${entry.userId ?? entry.position}`}
                      className="text-sm font-semibold text-white transition hover:text-cyan-200"
                    >
                      {entry.name}
                    </Link>
                    <span className="text-xs text-white/50">Club runner</span>
                  </div>
                </div>
                <span className="text-lg font-semibold text-white">
                  {entry.score}
                </span>
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
          <span className="text-xs text-white/50">
            Page {page} of {totalPages} · {pageSize} per page
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-3"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page <= 1}
            >
              Prev
            </Button>
            {pageWindow.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setPage(pageNumber)}
                className={`h-9 min-w-[2.25rem] rounded-full border px-3 text-xs font-semibold transition ${
                  pageNumber === page
                    ? "border-cyan-300 bg-cyan-400/20 text-white"
                    : "border-white/10 bg-white/5 text-white/60 hover:text-white"
                }`}
              >
                {pageNumber}
              </button>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-3"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
