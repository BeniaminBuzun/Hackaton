import { Link } from "react-router"

import { Button } from "@components/button"
import AudioVisualizer from "@components/audiovis"

export default function Home() {
  return (
    <div className="flex min-h-[70vh] flex-col gap-14 pt-6">
      <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-black/90 via-slate-950/80 to-black/90 p-8 shadow-[0_0_60px_rgba(34,211,238,0.25)] md:p-12">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-10 top-10 h-32 w-32 rounded-full bg-cyan-400/25 blur-3xl" />
          <div className="absolute bottom-6 left-12 h-28 w-28 rounded-full bg-fuchsia-500/25 blur-2xl" />
          <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/20 blur-[90px]" />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-cyan-400/10 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 grid gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div className="flex flex-col gap-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
              Cyberpunk Club Mode
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-semibold leading-tight text-white md:text-5xl">
                Enter the neon club and sync with the beat.
              </h1>
              <AudioVisualizer audioUrl="skolim.mp3"></AudioVisualizer>
              <p className="max-w-xl text-base text-white/70 md:text-lg">
                Pulse Quiz is your late-night soundcheck. Identify the track, lock
                the vibe, and race the laser-lit leaderboard.
              </p>
            </div>
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg" className="h-11 px-6 text-base">
                <Link to="/quiz/neon-club">Enter the dancefloor</Link>
              </Button>
              <span className="text-sm text-white/50">
                Doors open soon.
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                  Tonight&apos;s set
                </p>
                <span className="rounded-full bg-cyan-400/20 px-3 py-1 text-xs font-semibold text-cyan-200">
                  Pulse
                </span>
              </div>
              <div className="mt-6 space-y-4 text-sm text-white/80">
                <div className="flex items-center justify-between">
                  <span>Tempo Surge</span>
                  <span className="text-white/50">122 BPM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Genre Drift</span>
                  <span className="text-white/50">Neo-house · Synth</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Glow Streak</span>
                  <span className="text-white/50">x7</span>
                </div>
              </div>
              <div className="mt-6 h-1.5 w-full rounded-full bg-white/10">
                <div className="h-1.5 w-2/3 rounded-full bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-emerald-300" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {["12 tracks", "90 seconds", "Club mix"].map((item) => (
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
