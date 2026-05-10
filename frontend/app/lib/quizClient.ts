import { postJson } from "./apiClient"

export type ChoiceId = "a" | "b" | "c" | "d"

export type QuizChoice = {
  id: ChoiceId
  label: "A" | "B" | "C" | "D"
  text: string
}

export type QuizQuestion = {
  id: string
  text: string
  choices: QuizChoice[]
}

export type QuizStartPayload = {
  quizId: string
  total: number
  index: number
  question: QuizQuestion
}

export type QuizAnswerPayload = {
  quizId: string
  questionId: string
  choiceId: ChoiceId
}

export type QuizAnswerResult = {
  isCorrect: boolean
  nextQuestion: QuizQuestion | null
  nextIndex: number
  total: number
}

export type QuizResult = {
  quizId: string
  correct: number
  total: number
}

export type QuizClient = {
  startQuiz: (quizId: string) => Promise<QuizStartPayload>
  submitAnswer: (payload: QuizAnswerPayload) => Promise<QuizAnswerResult>
  finalizeQuiz: (quizId: string) => Promise<QuizResult>
}

type MockQuestion = QuizQuestion & { correctChoiceId: ChoiceId }

type MockQuiz = {
  id: string
  title: string
  questions: MockQuestion[]
}

type MockSession = {
  quizId: string
  currentIndex: number
  answers: QuizAnswerPayload[]
}

const mockQuizzes: Record<string, MockQuiz> = {
  "neon-club": {
    id: "neon-club",
    title: "Neon Club",
    questions: [
      {
        id: "tempo-surge",
        text: "Which BPM range defines a classic club tempo?",
        choices: [
          { id: "a", label: "A", text: "60-80 BPM" },
          { id: "b", label: "B", text: "90-110 BPM" },
          { id: "c", label: "C", text: "120-130 BPM" },
          { id: "d", label: "D", text: "150-170 BPM" },
        ],
        correctChoiceId: "c",
      },
      {
        id: "laser-warmup",
        text: "What is the best way to warm up a dancefloor?",
        choices: [
          { id: "a", label: "A", text: "Drop the loudest track first" },
          { id: "b", label: "B", text: "Build a steady groove" },
          { id: "c", label: "C", text: "Play only vocals" },
          { id: "d", label: "D", text: "Silence for 2 minutes" },
        ],
        correctChoiceId: "b",
      },
      {
        id: "genre-drift",
        text: "Which element makes a neo-house track feel futuristic?",
        choices: [
          { id: "a", label: "A", text: "Analog synth stabs" },
          { id: "b", label: "B", text: "Country banjos" },
          { id: "c", label: "C", text: "Acoustic piano solo" },
          { id: "d", label: "D", text: "Solo trumpet" },
        ],
        correctChoiceId: "a",
      },
      {
        id: "glow-streak",
        text: "What signals the perfect moment for a drop?",
        choices: [
          { id: "a", label: "A", text: "Lower the tempo" },
          { id: "b", label: "B", text: "Cut the kick" },
          { id: "c", label: "C", text: "Filter builds tension" },
          { id: "d", label: "D", text: "Add more silence" },
        ],
        correctChoiceId: "c",
      },
      {
        id: "pulse-anthem",
        text: "Which instrument is a club anthem staple?",
        choices: [
          { id: "a", label: "A", text: "Sub-bass" },
          { id: "b", label: "B", text: "Accordion" },
          { id: "c", label: "C", text: "Harpsichord" },
          { id: "d", label: "D", text: "Oboe" },
        ],
        correctChoiceId: "a",
      },
    ],
  },
}

const mockSessions = new Map<string, MockSession>()

const toPublicQuestion = (question: MockQuestion): QuizQuestion => ({
  id: question.id,
  text: question.text,
  choices: question.choices,
})

const getMockQuiz = (quizId: string): MockQuiz => {
  const quiz = mockQuizzes[quizId]
  if (!quiz) {
    throw new Error("Quiz not found")
  }
  return quiz
}

const mockClient: QuizClient = {
  startQuiz: async (quizId) => {
    const quiz = getMockQuiz(quizId)
    const session: MockSession = {
      quizId,
      currentIndex: 0,
      answers: [],
    }

    mockSessions.set(quizId, session)

    return {
      quizId,
      total: quiz.questions.length,
      index: 1,
      question: toPublicQuestion(quiz.questions[0]),
    }
  },
  submitAnswer: async ({ quizId, questionId, choiceId }) => {
    const quiz = getMockQuiz(quizId)
    const session = mockSessions.get(quizId)
    if (!session) {
      throw new Error("Quiz has not been started")
    }

    const currentQuestion = quiz.questions.find(
      (question) => question.id === questionId
    )

    if (!currentQuestion) {
      throw new Error("Question not found")
    }

    session.answers.push({ quizId, questionId, choiceId })
    session.currentIndex = Math.min(
      session.currentIndex + 1,
      quiz.questions.length
    )

    const nextQuestion = quiz.questions[session.currentIndex] ?? null
    const nextIndex = Math.min(session.currentIndex + 1, quiz.questions.length)

    return {
      isCorrect: currentQuestion.correctChoiceId === choiceId,
      nextQuestion: nextQuestion ? toPublicQuestion(nextQuestion) : null,
      nextIndex,
      total: quiz.questions.length,
    }
  },
  finalizeQuiz: async (quizId) => {
    const quiz = getMockQuiz(quizId)
    const session = mockSessions.get(quizId)
    if (!session) {
      return { quizId, correct: 0, total: quiz.questions.length }
    }

    const correct = session.answers.reduce((count, answer) => {
      const question = quiz.questions.find((item) => item.id === answer.questionId)
      if (!question) {
        return count
      }
      return count + (question.correctChoiceId === answer.choiceId ? 1 : 0)
    }, 0)

    return {
      quizId,
      correct,
      total: quiz.questions.length,
    }
  },
}

const apiClient: QuizClient = {
  startQuiz: async (quizId) => {
    const response = await postJson(`/api/quizzes/${quizId}/start`)

    if (!response.ok) {
      throw new Error("Unable to start quiz")
    }

    return (await response.json()) as QuizStartPayload
  },
  submitAnswer: async ({ quizId, questionId, choiceId }) => {
    const response = await postJson(`/api/quizzes/${quizId}/answer`, {
      body: { questionId, choiceId },
    })

    if (!response.ok) {
      throw new Error("Unable to submit answer")
    }

    return (await response.json()) as QuizAnswerResult
  },
  finalizeQuiz: async (quizId) => {
    const response = await postJson(`/api/quizzes/${quizId}/finish`)

    if (!response.ok) {
      throw new Error("Unable to finalize quiz")
    }

    return (await response.json()) as QuizResult
  },
}

export const quizClient: QuizClient = mockClient
export { apiClient, mockClient }
