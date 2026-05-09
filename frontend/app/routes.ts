import { type RouteConfig, index, route } from "@react-router/dev/routes"

export default [
	index("routes/home.tsx"),
	route("quiz/:quizId", "routes/quiz.tsx"),
	route("result", "routes/result.tsx"),
] satisfies RouteConfig
