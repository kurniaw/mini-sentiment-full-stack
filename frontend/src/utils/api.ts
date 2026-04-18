import type { BackendSummary } from '../types/feedbackType'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function submitFeedback(
  rating: number,
  comment: string,
): Promise<void> {
  if (!API_URL) return

  const res = await fetch(`${API_URL}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rating, comment }),
  })

  if (!res.ok) {
    throw new Error(`Failed to submit feedback: ${res.status}`)
  }
}

export async function resetData(): Promise<void> {
  if (!API_URL) return

  const res = await fetch(`${API_URL}/feedback`, { method: 'DELETE' })
  if (!res.ok) {
    throw new Error(`Reset failed: ${res.status}`)
  }
}

export async function fetchSummary(): Promise<BackendSummary | null> {
  if (!API_URL) return null

  const res = await fetch(`${API_URL}/feedback/summary`)
  if (!res.ok) {
    throw new Error(`Failed to fetch summary: ${res.status}`)
  }
  return res.json() as Promise<BackendSummary>
}
