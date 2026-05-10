import AudioVisualizer from "@components/audiovis";
import MusicPlayer from "@components/musicPlayer";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router";

export default function QuizRoute2() {
  const location = useLocation();
  const data = location.state;

  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  console.log(data.questionsForMusic.length);
  if (!data || !data.questionsForMusic || data.questionsForMusic.length === 0) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-full max-w-4xl flex-col items-center justify-center gap-10 pt-6">
        <section className="rounded-[2.5rem] border border-white/10 bg-white/5 px-8 py-12 text-center shadow-[0_0_60px_rgba(34,211,238,0.15)]">
          <h1 className="text-2xl font-semibold text-white md:text-4xl">
            No data available
          </h1>
          <p className="mt-4 text-base text-white/70">
            Please start from the beginning.
          </p>
        </section>
      </div>
    );
  }

  const currentItem = data.questionsForMusic[currentIndex];
  const isLastItem = currentIndex >= data.questionsForMusic.length - 1;

  const answerQuestion = (response: string) => {
    console.log("sending POST to server");
    console.log(response);
    if (!isLastItem) {
      if (response === "qqq") {
        console.log("correct answer");
      }
      else {
        console.log("wrong answer");
      }
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);

      }, 3000);

    } else {
      setTimeout(() => {
        navigate("/result");

      }, 3000);

    }
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-12 pt-6">
        {/* Header */}
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-black/90 via-slate-950/80 to-black/90 px-8 py-10 text-center shadow-[0_0_60px_rgba(34,211,238,0.25)]">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute right-10 top-10 h-28 w-28 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="absolute bottom-6 left-16 h-24 w-24 rounded-full bg-fuchsia-500/20 blur-2xl" />
            <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/15 blur-[90px]" />
          </div>

          <div className="relative z-10">
            <h1 className="text-3xl font-semibold tracking-wide text-white md:text-5xl">
              Music Quiz
            </h1>
            <p className="mt-3 text-sm font-semibold uppercase tracking-[0.3em] text-white/50">
              {/* Track {currentIndex + 1} of {data.questionsForMusic.length} */}
            </p>
          </div>
        </div>

        {/* Player Card */}
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-6 shadow-[0_0_60px_rgba(34,211,238,0.15)] backdrop-blur-sm">
          <AudioVisualizer audioUrl={"http://"+currentItem.songUrl} />

          <div className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400">
              Question
            </p>
            <p className="mt-2 text-lg font-medium text-white">
              {currentItem.questions[0].question}
            </p>
          </div>
        </div>

        {/* Answers Grid */}
        <div className="grid gap-5 md:grid-cols-2">
          {currentItem.questions[0].answers.map((answer: string, index: number) => (
            <button
              key={index}
              onClick={() => answerQuestion(answer)}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-6 py-5 text-left text-white transition-all duration-200 hover:border-cyan-400/50 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(34,211,238,0.25)] active:scale-[0.98]"
            >
              {/* Subtle glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-fuchsia-500/0 opacity-0 transition-opacity duration-300 group-hover:from-cyan-500/10 group-hover:to-fuchsia-500/10 group-hover:opacity-100" />
              <span className="relative z-10 font-sans text-lg font-medium">
                {answer}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}