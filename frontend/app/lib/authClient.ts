type AuthRequest = {
  nick: string
  password: string
}

type AuthResponse = {
  userId: string | number
}

// Placeholder endpoints until backend is finalized.
const LOGIN_ENDPOINT = "/api/auth/login"
const REGISTER_ENDPOINT = "/api/auth/register"

const requestAuth = async (
  endpoint: string,
  payload: AuthRequest
): Promise<{ userId: string }> => {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error("Unable to authenticate")
  }

  const data = (await response.json().catch(() => ({}))) as Partial<AuthResponse>

  if (data.userId === undefined || data.userId === null) {
    throw new Error("Missing user id in response")
  }

  return { userId: String(data.userId) }
}

export const login = (payload: AuthRequest) => requestAuth(LOGIN_ENDPOINT, payload)

export const register = (payload: AuthRequest) =>
  requestAuth(REGISTER_ENDPOINT, payload)
