import { Link, useParams } from "react-router"

import { Button } from "@components/button"

import { useUserProfile } from "../hooks/useUserProfile"

const formatPercent = (value: number) => `${Math.max(0, Math.min(value, 100))}%`

export default function UserProfileRoute() {
  const { userId } = useParams()
  const { status, data, error, refresh } = useUserProfile(userId)

  if (status === "loading") {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-5xl flex-col gap-10 pt-6">
        <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-black/90 via-slate-950/80 to-black/90 px-8 py-12 shadow-[0_0_60px_rgba(34,211,238,0.25)]">
          <div className="flex flex-col gap-4">
            <div className="h-4 w-40 animate-pulse rounded-full bg-white/10" />
            <div className="h-10 w-72 animate-pulse rounded-2xl bg-white/10" />
            <div className="h-4 w-64 animate-pulse rounded-full bg-white/10" />
          </div>
        </section>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-5xl flex-col gap-10 pt-6">
        <section className="rounded-[2.5rem] border border-white/10 bg-white/5 px-8 py-12">
          <div className="flex flex-col items-start gap-3">
            <p className="text-sm font-semibold text-white">Unable to load profile</p>
            <p className="text-xs text-white/50">{error}</p>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm" onClick={refresh}>
                Try again
              </Button>
              <Button asChild size="sm">
                <Link to="/leaderboard">Back to leaderboard</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    )
  }

  if (!data) {
    return null
  }

  const { name, badges, stats } = data

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
              Public profile
            </p>
            <h1 className="text-3xl font-semibold text-white md:text-5xl">
              {name}
            </h1>
            <p className="max-w-2xl text-base text-white/70 md:text-lg">
              {formatPercent(stats.percentCorrect)} accuracy across {stats.totalQuizzes} sessions.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
                Percent correct
              </p>
              <p className="mt-3 text-3xl font-semibold text-white">
                {formatPercent(stats.percentCorrect)}
              </p>
              <div className="mt-4 h-2 w-full rounded-full bg-white/10">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-emerald-300"
                  style={{ width: formatPercent(stats.percentCorrect) }}
                />
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
                Total quizzes
              </p>
              <p className="mt-3 text-3xl font-semibold text-white">
                {stats.totalQuizzes}
              </p>
              <p className="mt-2 text-xs text-white/50">
                Sessions completed
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
                Total answers
              </p>
              <p className="mt-3 text-3xl font-semibold text-white">
                {stats.totalAnswers}
              </p>
              <p className="mt-2 text-xs text-white/50">
                Tracks matched
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[2.5rem] border border-white/10 bg-white/5 p-6 shadow-[0_0_40px_rgba(148,163,184,0.12)]">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/50">
              Badges
            </p>
            <p className="text-sm text-white/70">
              Proof of the loudest moments.
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link to="/leaderboard">See leaderboard</Link>
          </Button>
        </div>

        {badges.length === 0 ? (
          <div className="flex min-h-[180px] flex-col items-center justify-center gap-3 text-center">
            <p className="text-sm font-semibold text-white">No badges yet</p>
            <p className="text-xs text-white/50">
              Win a round to unlock the first one.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-4"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-fuchsia-500/10 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative z-10 flex items-center gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                    <img
                      src={badge.imageUrl}
                      alt={badge.label}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{badge.label}</p>
                    <p className="text-xs text-white/50">Unlocked badge</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
