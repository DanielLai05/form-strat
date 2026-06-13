import { auth } from '../config/firebase'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

/**
 * Fetch wrapper for the backend API.
 * - Prefixes BASE_URL + /api.
 * - Attaches the current user's Firebase ID token as a Bearer header (unless
 *   `auth: false` is passed for public endpoints).
 * - Parses JSON and throws a friendly Error with the API's message on failure.
 *
 *   const { data } = await apiFetch('/forms')
 *   await apiFetch('/forms', { method: 'POST', body: { title, fields } })
 */
export async function apiFetch(path, { method = 'GET', body, auth: useAuth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' }

  if (useAuth && auth?.currentUser) {
    const token = await auth.currentUser.getIdToken()
    headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}/api${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    const message = data?.error?.message || `Request failed (${res.status})`
    throw new Error(message)
  }

  return data
}
