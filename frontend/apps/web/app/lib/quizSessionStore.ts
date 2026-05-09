import type { QuizResult } from "./quizClient"

type QuizResultSummary = QuizResult

let latestResult: QuizResultSummary | null = null

export const setLatestResult = (result: QuizResultSummary) => {
  latestResult = result
}

export const getLatestResult = () => latestResult

export const clearLatestResult = () => {
  latestResult = null
}
