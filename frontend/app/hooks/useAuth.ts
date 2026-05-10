import { useCallback, useSyncExternalStore } from "react"

import { clearUserId, getUserId, subscribe } from "../lib/authStore"

type UseAuthState = {
  userId: string | null
  isAuthenticated: boolean
  logout: () => void
}

const getSnapshot = () => getUserId()
const getServerSnapshot = () => null

export const useAuth = (): UseAuthState => {
  const userId = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const logout = useCallback(() => {
    clearUserId()
  }, [])

  return {
    userId,
    isAuthenticated: Boolean(userId),
    logout,
  }
}
