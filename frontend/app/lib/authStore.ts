const STORAGE_KEY = "neonclub.userId"

type Listener = () => void

const listeners = new Set<Listener>()

const notify = () => {
  listeners.forEach((listener) => listener())
}

export const getUserId = (): string | null => {
  if (typeof window === "undefined") {
    return null
  }

  return sessionStorage.getItem(STORAGE_KEY)
}

export const setUserId = (userId: string) => {
  if (typeof window === "undefined") {
    return
  }

  sessionStorage.setItem(STORAGE_KEY, userId)
  notify()
}

export const clearUserId = () => {
  if (typeof window === "undefined") {
    return
  }

  sessionStorage.removeItem(STORAGE_KEY)
  notify()
}

export const subscribe = (listener: Listener) => {
  if (typeof window === "undefined") {
    return () => undefined
  }

  listeners.add(listener)

  const handleStorage = (event: StorageEvent) => {
    if (event.storageArea !== sessionStorage) {
      return
    }

    if (event.key === STORAGE_KEY) {
      listener()
    }
  }

  window.addEventListener("storage", handleStorage)

  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", handleStorage)
  }
}
