import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router"

import { useAuth } from "./useAuth"

type RequireAuthState = {
  isAuthenticated: boolean
}

export const useRequireAuth = (): RequireAuthState => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (isAuthenticated) {
      return
    }

    navigate("/login", {
      replace: true,
      state: { from: location.pathname },
    })
  }, [isAuthenticated, location.pathname, navigate])

  return { isAuthenticated }
}
