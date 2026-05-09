import { useCallback, useState } from "react"

import type {
  ChoiceId,
  QuizAnswerPayload,
  QuizClient,
  QuizQuestion,
  QuizResult,
} from "../lib/quizClient"
import { quizClient } from "../lib/quizClient"

type QuizProgress = {
  current: number
  total: number
}

type QuizFlowStatus = "idle" | "loading" | "ready" | "answering" | "done" | "error"

type QuizFlowState = {
  status: QuizFlowStatus
  question: QuizQuestion | null
  progress: QuizProgress
  error: string | null
  correctCount: number
  result: QuizResult | null
}

type QuizFlowActions = {
  start: () => Promise<void>
  submitAnswer: (choiceId: ChoiceId) => Promise<void>
  reset: () => void
}

type QuizFlow = QuizFlowState & QuizFlowActions

export const useQuizFlow = (quizId: string, client: QuizClient = quizClient): QuizFlow => {
  const [status, setStatus] = useState<QuizFlowStatus>("idle")
  const [question, setQuestion] = useState<QuizQuestion | null>(null)
  const [progress, setProgress] = useState<QuizProgress>({ current: 0, total: 0 })
  const [error, setError] = useState<string | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [result, setResult] = useState<QuizResult | null>(null)
  const [answers, setAnswers] = useState<QuizAnswerPayload[]>([])

  const reset = useCallback(() => {
    setStatus("idle")
    setQuestion(null)
    setProgress({ current: 0, total: 0 })
    setError(null)
    setCorrectCount(0)
    setResult(null)
    setAnswers([])
  }, [])

  const start = useCallback(async () => {
    setStatus("loading")
    setError(null)

    try {
      const payload = await client.startQuiz(quizId)
      setQuestion(payload.question)
      setProgress({ current: payload.index, total: payload.total })
      setStatus("ready")
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to load quiz")
      setStatus("error")
    }
  }, [client, quizId])

  const submitAnswer = useCallback(
    async (choiceId: ChoiceId) => {
      if (!question) {
        return
      }

      setStatus("answering")
      setError(null)

      try {
        const payload = await client.submitAnswer({
          quizId,
          questionId: question.id,
          choiceId,
        })

        setAnswers((prev) => [
          ...prev,
          { quizId, questionId: question.id, choiceId },
        ])

        if (payload.isCorrect) {
          setCorrectCount((prev) => prev + 1)
        }

        if (payload.nextQuestion) {
          setQuestion(payload.nextQuestion)
          setProgress({ current: payload.nextIndex, total: payload.total })
          setStatus("ready")
          return
        }

        const finalResult = await client.finalizeQuiz(quizId)
        setResult({
          quizId,
          correct: finalResult.correct,
          total: finalResult.total,
        })
        setStatus("done")
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Unable to submit answer")
        setStatus("error")
      }
    },
    [client, question, quizId]
  )

  return {
    status,
    question,
    progress,
    error,
    correctCount,
    result,
    start,
    submitAnswer,
    reset,
  }
}
