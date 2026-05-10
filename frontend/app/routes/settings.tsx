import { useState } from "react";
import { Link } from "react-router";
import { Button } from "@components/button";

type SettingsForm = {
  numQuestions: number;
  genre: string;
  questionTypes: {
    genre: boolean;
    date: boolean;
    authors: boolean;
    skinColor: boolean;
    aiSlop: boolean;
  };
};

export default function SettingsPage() {
  const [numQuestions, setNumQuestions] = useState(5);
  const [genre, setGenre] = useState("none"); // "none" means no genre selected
  const [questionTypes, setQuestionTypes] = useState({
    genre: true,
    date: false,
    authors: false,
    skinColor: false,
    aiSlop: false,
  });

  // Condition: genre checkbox disabled when dropdown is NOT "none"
  const isGenreCheckboxDisabled = genre !== "none";

  const handleQuestionTypeChange = (field: keyof typeof questionTypes) => {
    setQuestionTypes((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleGo = () => {
    const formData: SettingsForm = {
      numQuestions,
      genre,
      questionTypes,
    };
    console.log("Settings values:", formData);
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-12 pt-6">
        {/* Header Card */}
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-black/90 via-slate-950/80 to-black/90 px-8 py-10 text-center shadow-[0_0_60px_rgba(34,211,238,0.25)]">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute right-10 top-10 h-28 w-28 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="absolute bottom-6 left-16 h-24 w-24 rounded-full bg-fuchsia-500/20 blur-2xl" />
            <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/15 blur-[90px]" />
          </div>
          <div className="relative z-10">
            <h1 className="text-3xl font-semibold text-white md:text-5xl">
              Quiz Settings
            </h1>
            <p className="mt-3 text-sm font-semibold uppercase tracking-[0.3em] text-white/50">
              Customise your experience
            </p>
          </div>
        </div>

        {/* Settings Form */}
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-6 shadow-[0_0_60px_rgba(34,211,238,0.15)] backdrop-blur-sm">
          <div className="space-y-8">
            {/* Number of Questions */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
                Number of questions
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={numQuestions}
                onChange={(e) => setNumQuestions(parseInt(e.target.value) || 1)}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition-all focus:border-cyan-400/50 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)]"
              />
            </div>

            {/* Genre Dropdown */}
            {/* <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
                Genre
              </label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition-all focus:border-cyan-400/50 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)]"
              >
                <option value="none">None (no genre filter)</option>
                <option value="rock">Rock</option>
                <option value="pop">Pop</option>
                <option value="electronic">Electronic</option>
                <option value="hiphop">Hip Hop</option>
                <option value="jazz">Jazz</option>
              </select>
              <p className="text-xs text-white/40">
                When a genre is selected, the "genre" question type is disabled.
              </p>
            </div> */}

            {/* Question Types (Checkboxes) */}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
                Question types
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* Genre Checkbox */}
                <label
                  className={`flex items-center gap-3 rounded-xl border border-white/10 bg-black/40 px-4 py-3 transition-all ${
                    isGenreCheckboxDisabled
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer hover:border-cyan-400/50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={questionTypes.genre}
                    onChange={() => handleQuestionTypeChange("genre")}
                    disabled={isGenreCheckboxDisabled}
                    className="h-4 w-4 rounded border-white/20 bg-black/60 text-cyan-400 focus:ring-cyan-400/50"
                  />
                  <span className="text-white/90">Genre</span>
                </label>

                {/* Date */}
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-black/40 px-4 py-3 transition-all hover:border-cyan-400/50">
                  <input
                    type="checkbox"
                    checked={questionTypes.date}
                    onChange={() => handleQuestionTypeChange("date")}
                    className="h-4 w-4 rounded border-white/20 bg-black/60 text-cyan-400 focus:ring-cyan-400/50"
                  />
                  <span className="text-white/90">Date</span>
                </label>

                {/* Authors */}
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-black/40 px-4 py-3 transition-all hover:border-cyan-400/50">
                  <input
                    type="checkbox"
                    checked={questionTypes.authors}
                    onChange={() => handleQuestionTypeChange("authors")}
                    className="h-4 w-4 rounded border-white/20 bg-black/60 text-cyan-400 focus:ring-cyan-400/50"
                  />
                  <span className="text-white/90">Authors</span>
                </label>

                {/* Skin Color */}
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-black/40 px-4 py-3 transition-all hover:border-cyan-400/50">
                  <input
                    type="checkbox"
                    checked={questionTypes.skinColor}
                    onChange={() => handleQuestionTypeChange("skinColor")}
                    className="h-4 w-4 rounded border-white/20 bg-black/60 text-cyan-400 focus:ring-cyan-400/50"
                  />
                  <span className="text-white/90">Skin color</span>
                </label>

                {/* AI Slop */}
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-black/40 px-4 py-3 transition-all hover:border-cyan-400/50">
                  <input
                    type="checkbox"
                    checked={questionTypes.aiSlop}
                    onChange={() => handleQuestionTypeChange("aiSlop")}
                    className="h-4 w-4 rounded border-white/20 bg-black/60 text-cyan-400 focus:ring-cyan-400/50"
                  />
                  <span className="text-white/90">AI slop</span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
              <Button
                onClick={handleGo}
                size="lg"
                className="h-11 px-6 text-base"
              >
                GO → Start quiz
              </Button>
              <Button asChild variant="outline" size="lg" className="h-11 px-6 text-base">
                <Link to="/">Back home</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}