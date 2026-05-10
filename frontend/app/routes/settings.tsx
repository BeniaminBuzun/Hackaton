import { useState } from "react";
import { Button } from "@components/button";
import { useRequireAuth } from "../hooks/useRequireAuth";
import { useNavigate, Link } from "react-router"
import { getUserId } from "@/lib/authStore";
import axios from "axios";

type SettingsForm = {
  numQuestions: number;
  questionTypes: {
    genre: boolean;
    timePeriod: boolean;
    artists: boolean;
    songName: boolean;
  };
};

export default function SettingsPage() {
  const { isAuthenticated } = useRequireAuth();
  const navigate = useNavigate();
  const [numQuestions, setNumQuestions] = useState(5);
  const [questionTypes, setQuestionTypes] = useState({
    genre: true,
    artists: false,
    songName: false,
    timePeriod: false
  });
  const userId = getUserId()
  async function sendQuizRequest() {
    if (!isAuthenticated) {
      navigate("/login", {
        replace: true,
        state: { from: location.pathname },
      })
      return
    }
    const url = 'http://localhost:8081/api/quizes';
    const body = {
      options: {
        "GENRE": questionTypes.genre,
        "ARTISTS": questionTypes.artists,
        "SONG_NAME": questionTypes.songName,
        "TIME_PERIOD": questionTypes.timePeriod,
      },
      "retake": false,
      "userId": userId,
    };

    try {
      const response = await axios.post(url, body, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log(  'Response:', response.data);
      navigate('/quiz2', { state: response.data });

    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handleQuestionTypeChange = (field: keyof typeof questionTypes) => {
    setQuestionTypes((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleGo = () => {
    sendQuizRequest()
  };

  if (!isAuthenticated) {
    return null;
  }

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
            {/* <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
                Number of questions
              </label>
              <input
                type="number"
                min={1}
                max={150}
                value={numQuestions}
                onChange={(e) => setNumQuestions(parseInt(e.target.value) || 1)}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition-all focus:border-cyan-400/50 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)]"
              />
            </div> */}

            {/* Question Types (Checkboxes) */}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
                Question types
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* Genre Checkbox */}
                <label
                  className={`flex items-center gap-3 rounded-xl border border-white/10 bg-black/40 px-4 py-3 transition-all cursor-pointer hover:border-cyan-400/50`}
                >
                  <input
                    type="checkbox"
                    checked={questionTypes.genre}
                    onChange={() => handleQuestionTypeChange("genre")}
                    className="h-4 w-4 rounded border-white/20 bg-black/60 text-cyan-400 focus:ring-cyan-400/50"
                  />
                  <span className="text-white/90">Genre</span>
                </label>

                {/* Date */}
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-black/40 px-4 py-3 transition-all hover:border-cyan-400/50">
                  <input
                    type="checkbox"
                    checked={questionTypes.timePeriod}
                    onChange={() => handleQuestionTypeChange("timePeriod")}
                    className="h-4 w-4 rounded border-white/20 bg-black/60 text-cyan-400 focus:ring-cyan-400/50"
                  />
                  <span className="text-white/90">Date</span>
                </label>

                {/* Authors */}
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-black/40 px-4 py-3 transition-all hover:border-cyan-400/50">
                  <input
                    type="checkbox"
                    checked={questionTypes.artists}
                    onChange={() => handleQuestionTypeChange("artists")}
                    className="h-4 w-4 rounded border-white/20 bg-black/60 text-cyan-400 focus:ring-cyan-400/50"
                  />
                  <span className="text-white/90">Authors</span>
                </label>

                {/* Skin Color */}
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-black/40 px-4 py-3 transition-all hover:border-cyan-400/50">
                  <input
                    type="checkbox"
                    checked={questionTypes.songName}
                    onChange={() => handleQuestionTypeChange("songName")}
                    className="h-4 w-4 rounded border-white/20 bg-black/60 text-cyan-400 focus:ring-cyan-400/50"
                  />
                  <span className="text-white/90">Song name</span>
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
                Start quiz
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