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
  const response = await fetch(`/api/users/${userId}/profile`, { signal })

  if (!response.ok) {
    throw new Error("Unable to load user profile")
  }

  const payload = (await response.json()) as UserProfile

  return {
    userId: payload.userId ?? userId,
    name: payload.name ?? "Unknown user",
    badges: payload.badges ?? [],
    stats: {
      totalQuizzes: payload.stats?.totalQuizzes ?? 0,
      totalAnswers: payload.stats?.totalAnswers ?? 0,
      percentCorrect: payload.stats?.percentCorrect ?? 0,
    },
  }
}
