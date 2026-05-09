import { type RouteConfig, index, route } from "@react-router/dev/routes"

export default [
	index("routes/home.tsx"),
	route("quiz/:quizId", "routes/quiz.tsx"),
	route("quiz2", "routes/quiz2.tsx"),
	route("settings", "routes/settings.tsx"),

	route("result", "routes/result.tsx"),
	route("leaderboard", "routes/leaderboard.tsx"),
] satisfies RouteConfig
