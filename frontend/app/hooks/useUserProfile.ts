import { useCallback, useEffect, useState } from "react"

import type { UserProfile } from "../lib/userProfileClient"
import { fetchUserProfile } from "../lib/userProfileClient"

type UserProfileStatus = "idle" | "loading" | "ready" | "error"

type UserProfileState = {
  status: UserProfileStatus
  data: UserProfile | null
  error: string | null
}

type UseUserProfile = UserProfileState & {
  refresh: () => void
}

export const useUserProfile = (userId?: string): UseUserProfile => {
  const [status, setStatus] = useState<UserProfileStatus>("idle")
  const [data, setData] = useState<UserProfile | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [refreshTick, setRefreshTick] = useState(0)

  const refresh = useCallback(() => {
    setRefreshTick((prev) => prev + 1)
  }, [])

  useEffect(() => {
    if (!userId) {
      setStatus("error")
      setError("User id is missing")
      setData(null)
      return
    }

    const controller = new AbortController()

    const load = async () => {
      setStatus("loading")
      setError(null)

      try {
        const profile = await fetchUserProfile(userId, controller.signal)
        setData(profile)
        setStatus("ready")
      } catch (caught) {
        if (controller.signal.aborted) {
          return
        }

        setError(
          caught instanceof Error ? caught.message : "Unable to load user profile"
        )
        setStatus("error")
      }
    }

    load()

    return () => {
      controller.abort()
    }
  }, [userId, refreshTick])

  return { status, data, error, refresh }
}
