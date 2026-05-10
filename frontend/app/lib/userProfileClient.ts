export type UserBadge = {
  id: string
  label: string
  imageUrl: string
}

export type UserStats = {
  totalQuizzes: number
  totalAnswers: number
  percentCorrect: number
}

type UserStatsApiResponse = {
  userId: number
  totalAnswers: number
  correctAnswers: number
  accuracyPercent: number
}

type UserApiResponse = {
  userId: number
  username: string
}

const DEFAULT_API_BASE_URL = "http://localhost:8081"
const API_BASE_URL =
  (import.meta as ImportMeta).env?.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL

const getStatsUrl = (userId: string) =>
  new URL(`/api/stats/${userId}`, API_BASE_URL).toString()
const getUsernameUrl = (userId: string) =>
  new URL(`/user/${userId}`, API_BASE_URL).toString()

export type UserProfile = {
  userId: string
  name: string
  badges: UserBadge[]
  stats: UserStats
}

export const fetchUserProfile = async (
  userId: string,
  signal?: AbortSignal
): Promise<UserProfile> => {
  const [statsResponse, nameResponse] = await Promise.all([
    fetch(getStatsUrl(userId), { signal }),
    fetch(getUsernameUrl(userId), { signal }),
  ])

  if (!statsResponse.ok || !nameResponse.ok) {
    throw new Error("Unable to load user profile")
  }

  const statsPayload = (await statsResponse.json()) as UserStatsApiResponse
  const namePayload = (await nameResponse.json()) as UserApiResponse

  return {
    userId: String(statsPayload.userId ?? userId),
    name:
      namePayload.username.length > 0 ? namePayload.username : "Unknown user",
    badges: [],
    stats: {
      totalQuizzes: 0,
      totalAnswers: statsPayload.totalAnswers ?? 0,
      percentCorrect: statsPayload.accuracyPercent ?? 0,
    },
  }
}
