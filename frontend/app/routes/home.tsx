import { Link,useNavigate } from "react-router"

import { Button } from "@components/button"
import axios from 'axios';
import { use } from "react";
export default function Home() {
  // Placeholder variables for scores

  const last10DaysScore = 12580 
  const globalScore = 98420

  const accuracy = 53

  const bottomStats = ["Daily Challenges", "Global Ranking", "10-Day Streak"]
  const navigate = useNavigate();
  async function sendQuizRequest() {
    const url = 'http://localhost:8081/api/quizes';
    const body = {
      options: {
        "GENRE": true,
        "ARTISTS": false,
        "SONG_NAME": false,
        "TIME_PERIOD": false,
      },
      "retake": false,
      "userId": 1,
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
            <div className="space-y-4">
              <h1 className="text-3xl font-semibold leading-tight text-white md:text-5xl">
                🎵 Music Guesser
              </h1>
              <p className="max-w-xl text-base text-white/70 md:text-lg">
                Guess the song from short clips, test your music knowledge, and compete
                daily. Compare your scores from the last 10 days and climb the global
                leaderboard.
              </p>
            </div>
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Button onClick={sendQuizRequest} size="lg" className="h-11 px-6 text-base">
                {/* <Link 
                  to="/quiz2" 
                  state={{
    "questionsForMusic": [
        {
            "questions": [
                {
                    "answers": [
                        "House",
                        "Alternative",
                        "Roots Reggae",
                        "Música tropical"
                    ],
                    "id": 37,
                    "question": "What genre is this song?"
                }
            ],
            "songUrl": "127.0.0.1:8081/016.m4a"
        },
        {
            "questions": [
                {
                    "answers": [
                        "Pop",
                        "IDM/Experimental",
                        "Musicals",
                        "Metal"
                    ],
                    "id": 36,
                    "question": "What genre is this song?"
                }
            ],
            "songUrl": "127.0.0.1:8081/001.m4a"
        },
        {
            "questions": [
                {
                    "answers": [
                        "Anime",
                        "Reggae",
                        "Country",
                        "Metal"
                    ],
                    "id": 33,
                    "question": "What genre is this song?"
                }
            ],
            "songUrl": "127.0.0.1:8081/021.m4a"
        },
        {
            "questions": [
                {
                    "answers": [
                        "R&B/Soul",
                        "Metal",
                        "Alternative Folk",
                        "Worldwide"
                    ],
                    "id": 39,
                    "question": "What genre is this song?"
                }
            ],
            "songUrl": "127.0.0.1:8081/025.m4a"
        },
        {
            "questions": [
                {
                    "answers": [
                        "Relaxation",
                        "Techno",
                        "Pop",
                        "Reggae"
                    ],
                    "id": 34,
                    "question": "What genre is this song?"
                }
            ],
            "songUrl": "127.0.0.1:8081/026.m4a"
        },
        {
            "questions": [
                {
                    "answers": [
                        "Techno",
                        "Vocal Pop",
                        "Hard Rock",
                        "Original Score"
                    ],
                    "id": 38,
                    "question": "What genre is this song?"
                }
            ],
            "songUrl": "127.0.0.1:8081/010.m4a"
        },
        {
            "questions": [
                {
                    "answers": [
                        "IDM/Experimental",
                        "Pop Latino",
                        "Hard Rock",
                        "Korean Hip-Hop"
                    ],
                    "id": 31,
                    "question": "What genre is this song?"
                }
            ],
            "songUrl": "127.0.0.1:8081/011.m4a"
        },
        {
            "questions": [
                {
                    "answers": [
                        "Hard Rock",
                        "Reggae",
                        "Holiday",
                        "Urbano latino"
                    ],
                    "id": 35,
                    "question": "What genre is this song?"
                }
            ],
            "songUrl": "127.0.0.1:8081/012.m4a"
        },
        {
            "questions": [
                {
                    "answers": [
                        "Afrobeats",
                        "Hip-Hop/Rap",
                        "Funk",
                        "Folk"
                    ],
                    "id": 32,
                    "question": "What genre is this song?"
                }
            ],
            "songUrl": "127.0.0.1:8081/028.m4a"
        },
        {
            "questions": [
                {
                    "answers": [
                        "Alternative Rap",
                        "Classical",
                        "Hard Rock",
                        "French Pop"
                    ],
                    "id": 40,
                    "question": "What genre is this song?"
                }
            ],
            "songUrl": "127.0.0.1:8081/015.m4a"
        }
    ],
    "quizId": 3
}}
                > */}
                  Quick Game
                {/* </Link> */}
                
              </Button>
              <Button asChild variant="outline" size="lg" className="h-11 px-6 text-base">
                <Link to="/settings">New Custom Game</Link>
              </Button>

              <Button asChild variant="outline" size="lg" className="h-11 px-6 text-base">
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
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                  Your score
                </p>
              </div>
              <div className="mt-6 space-y-4 text-sm text-white/80">
                <div className="flex items-center justify-between">
                  <span>Last 10 days</span>
                  <span className="font-mono font-semibold text-cyan-200">
                    {last10DaysScore.toLocaleString()} pts
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Global all-time</span>
                  <span className="font-mono font-semibold text-fuchsia-200">
                    {globalScore.toLocaleString()} pts
                  </span>
                </div>
              </div>
              <div className="mt-6 space-y-2">
                <div className="h-1.5 w-full rounded-full bg-white/10">
                  <div 
                    className="h-1.5 rounded-full bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-emerald-300"
                    style={{ width: `${accuracy}%` }}
                  />
                </div>
                <p className="text-right text-xs text-white/40">
                  accuracy {Math.round(accuracy)}%
                </p>
              </div>
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