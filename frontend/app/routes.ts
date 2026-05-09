import { type RouteConfig, index, route } from "@react-router/dev/routes"

export default [
	index("routes/home.tsx"),
	route("quiz/:quizId", "routes/quiz.tsx"),
	route("quiz2", "routes/quiz2.tsx"),

	route("result", "routes/result.tsx"),
	route("leaderboard", "routes/leaderboard.tsx"),
	route("users/:userId", "routes/user-profile.tsx"),
] satisfies RouteConfig
