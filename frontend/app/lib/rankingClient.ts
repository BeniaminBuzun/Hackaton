export type RankingType = "general" | "genre" | "author"

export type RankingEntry = {
  position: number
  name: string
  score: number
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

export const fetchRankings = async (
  query: RankingQuery,
  signal?: AbortSignal
): Promise<RankingResponse> => {
  const params = new URLSearchParams({
    type: query.type,
    page: String(query.page),
    pageSize: String(query.pageSize),
  })

  const response = await fetch(`/api/rankings?${params.toString()}`, { signal })

  if (!response.ok) {
    throw new Error("Unable to load rankings")
  }

  const payload = (await response.json()) as RankingResponse

  return {
    items: payload.items ?? [],
    page: payload.page ?? query.page,
    pageSize: payload.pageSize ?? query.pageSize,
    totalPages: payload.totalPages ?? 1,
    totalItems: payload.totalItems ?? payload.items?.length ?? 0,
  }
}
