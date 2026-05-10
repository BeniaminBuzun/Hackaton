import { getUserId } from "./authStore"

type JsonBody = Record<string, unknown> | undefined

type PostJsonOptions = Omit<RequestInit, "method" | "body"> & {
  body?: JsonBody
}

export const withUserId = (body: JsonBody = {}) => {
  const userId = getUserId()
  const baseBody = body ?? {}

  if (!userId) {
    return baseBody
  }

  if (body && Object.hasOwn(body, "userId")) {
    return body
  }

  return {
    ...baseBody,
    userId,
  }
}

export const postJson = async (url: string, options: PostJsonOptions = {}) => {
  const { body, headers, ...rest } = options
  const mergedHeaders = headers
    ? { "Content-Type": "application/json", ...headers }
    : { "Content-Type": "application/json" }

  return fetch(url, {
    ...rest,
    method: "POST",
    headers: mergedHeaders,
    body: JSON.stringify(withUserId(body)),
  })
}
