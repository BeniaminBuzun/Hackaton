import { useCallback, useEffect, useMemo, useState } from "react"

import type { RankingResponse, RankingType } from "../lib/rankingClient"
import { fetchRankings } from "../lib/rankingClient"

type RankingStatus = "idle" | "loading" | "ready" | "error"

type RankingState = {
  status: RankingStatus
  data: RankingResponse | null
  error: string | null
}

type UseRankingOptions = {
  initialType?: RankingType
  initialPage?: number
  pageSize?: number
}

type UseRanking = RankingState & {
  type: RankingType
  page: number
  pageSize: number
  setType: (next: RankingType) => void
  setPage: (next: number) => void
  refresh: () => void
}

const DEFAULT_PAGE_SIZE = 10
const DEFAULT_TYPE: RankingType = "general"

export const useRanking = (options: UseRankingOptions = {}): UseRanking => {
  const [type, setTypeState] = useState<RankingType>(
    options.initialType ?? DEFAULT_TYPE
  )
  const [page, setPageState] = useState(options.initialPage ?? 1)
  const pageSize = options.pageSize ?? DEFAULT_PAGE_SIZE

  const [status, setStatus] = useState<RankingStatus>("idle")
  const [data, setData] = useState<RankingResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [refreshTick, setRefreshTick] = useState(0)

  const setType = useCallback((next: RankingType) => {
    setTypeState(next)
    setPageState(1)
  }, [])

  const setPage = useCallback((next: number) => {
    setPageState(next)
  }, [])

  const refresh = useCallback(() => {
    setRefreshTick((prev) => prev + 1)
  }, [])

  const query = useMemo(
    () => ({ type, page, pageSize }),
    [type, page, pageSize]
  )

  useEffect(() => {
    const controller = new AbortController()

    const load = async () => {
      setStatus("loading")
      setError(null)

      try {
        const response = await fetchRankings(query, controller.signal)
        setData(response)
        setStatus("ready")
      } catch (caught) {
        if (controller.signal.aborted) {
          return
        }

        setError(caught instanceof Error ? caught.message : "Unable to load rankings")
        setStatus("error")
      }
    }

    load()

    return () => controller.abort()
  }, [query, refreshTick])

  return {
    status,
    data,
    error,
    type,
    page,
    pageSize,
    setType,
    setPage,
    refresh,
  }
}
