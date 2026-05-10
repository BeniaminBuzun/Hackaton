import axios from "axios"


export type RankingType =
  | "general"
  | "genre"
  | "author"
  | "song_name"
  | "time_period"

export type RankingEntry = {
  rank: number
  username: string
  userId: number
  score: number
  accuracyPercent: number
  totalAnswers: number
  correctAnswers: number
}

export type RankingResponse = {
  items: RankingEntry[]
  page: number
  pageSize: number
  totalPages: number
  totalItems: number
}

export type RankingQuery = {
  type: RankingType
  page: number
  pageSize: number
}

const typeToCategory = (type: RankingType): string => {
  switch (type) {
    case "general":     return "OVERALL"
    case "genre":       return "GENRE"
    case "author":      return "ARTISTS"
    case "song_name":   return "SONG_NAME"
    case "time_period": return "TIME_PERIOD"
  }
}

export const fetchRankings = async (
  query: RankingQuery,
  signal?: AbortSignal
): Promise<RankingResponse> => {
  const response = await axios.get(
    "http://localhost:8081/api/stats/leaderboard",
    {
      params: {
        page: query.page,
        limit: query.pageSize,
        category: typeToCategory(query.type),
      },
      signal,
    }
  )

  const payload = response.data

  const items: RankingEntry[] = (payload.data ?? []).map((entry: any) => ({
    rank: entry.rank,
    username: entry.username,
    userId: entry.userId,
    score: entry.accuracyPercent,
    accuracyPercent: entry.accuracyPercent,
    totalAnswers: entry.totalAnswers,
    correctAnswers: entry.correctAnswers,
  }))

  return {
    items,
    page: payload.meta?.page ?? query.page,
    pageSize: payload.meta?.limit ?? query.pageSize,
    totalPages: payload.meta?.totalPages ?? 1,
    totalItems: payload.meta?.totalPlayers ?? items.length,
  }
}