type AuthRequest = {
  nick: string
  password: string
}

type AuthResponse = {
  userId: string | number
  id?: string | number
}

const DEFAULT_API_BASE_URL = "http://127.0.0.1:8081"
const API_BASE_URL =
  (import.meta as ImportMeta).env?.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL

const LOGIN_ENDPOINT = new URL("/user/login", API_BASE_URL).toString()
const REGISTER_ENDPOINT = new URL("/user/registration", API_BASE_URL).toString()

const readErrorMessage = async (response: Response) => {
  const contentType = response.headers.get("Content-Type") ?? ""

  if (contentType.includes("application/json")) {
    const data = (await response.json().catch(() => ({}))) as {
      message?: string
      error?: string
    }

    if (typeof data.message === "string" && data.message.trim()) {
      return data.message.trim()
    }

    if (typeof data.error === "string" && data.error.trim()) {
      return data.error.trim()
    }
  }

  const text = await response.text().catch(() => "")
  if (text.trim()) {
    return text.trim()
  }

  return "Unable to authenticate"
}

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
    const message = await readErrorMessage(response)
    throw new Error(message)
  }

  const data = (await response.json().catch(() => ({}))) as Partial<AuthResponse>
  const resolvedUserId = data.userId ?? data.id

  if (resolvedUserId === undefined || resolvedUserId === null) {
    throw new Error("Missing user id in response")
  }

  return { userId: String(resolvedUserId) }
}

export const login = (payload: AuthRequest) => requestAuth(LOGIN_ENDPOINT, payload)

export const register = (payload: AuthRequest) =>
  requestAuth(REGISTER_ENDPOINT, payload)
