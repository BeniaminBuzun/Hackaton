import { useCallback, useSyncExternalStore } from "react"

import { clearUserId, getUserId, subscribe } from "../lib/authStore"
import { useNavigate } from "react-router"

type UseAuthState = {
  userId: string | null
  isAuthenticated: boolean
  logout: () => void
}

const getSnapshot = () => getUserId()
const getServerSnapshot = () => null

export const useAuth = (): UseAuthState => {
  const navigate = useNavigate()
  const userId = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const logout = useCallback(() => {
    clearUserId()
    navigate("/")
  }, [])

  return {
    userId,
    isAuthenticated: Boolean(userId),
    logout,
  }
}
