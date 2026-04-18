const mockFetch = jest.fn()
global.fetch = mockFetch

// API_URL is captured at module load time, so we must reset modules
// and re-import to pick up different env values per test group.

beforeEach(() => {
  mockFetch.mockReset()
  jest.resetModules()
})

describe('submitFeedback — with API URL', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3001'
  })

  it('POSTs to /feedback with correct body', async () => {
    mockFetch.mockResolvedValue({ ok: true })
    const { submitFeedback } = await import('../utils/api')

    await submitFeedback(4, 'good stuff')

    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: 4, comment: 'good stuff' }),
    })
  })

  it('throws on non-ok response', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 500 })
    const { submitFeedback } = await import('../utils/api')

    await expect(submitFeedback(1, '')).rejects.toThrow('Failed to submit feedback: 500')
  })
})

describe('fetchSummary — with API URL', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3001'
  })

  it('GETs /feedback/summary and returns parsed JSON', async () => {
    const summary = { total: 5, average: 3.4, recentComments: ['great', 'ok'] }
    mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(summary) })
    const { fetchSummary } = await import('../utils/api')

    const result = await fetchSummary()

    expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/feedback/summary')
    expect(result).toEqual(summary)
  })

  it('throws on non-ok response', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 503 })
    const { fetchSummary } = await import('../utils/api')

    await expect(fetchSummary()).rejects.toThrow('Failed to fetch summary: 503')
  })
})
