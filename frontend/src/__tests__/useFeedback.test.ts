import { renderHook, act } from '@testing-library/react'
import { useFeedback } from '../hooks/useFeedback'
import * as api from '../utils/api'

jest.mock('../utils/api')
const mockSubmitFeedback = api.submitFeedback as jest.Mock
const mockFetchSummary = api.fetchSummary as jest.Mock

beforeEach(() => {
  jest.useFakeTimers()
  mockSubmitFeedback.mockResolvedValue(undefined)
  mockFetchSummary.mockResolvedValue(null)
})

afterEach(() => {
  jest.useRealTimers()
})

describe('useFeedback — initial state', () => {
  it('starts with no rating, empty comment, and zero summary', () => {
    const { result } = renderHook(() => useFeedback())
    expect(result.current.selectedRating).toBeNull()
    expect(result.current.comment).toBe('')
    expect(result.current.summary).toEqual({ total: 0, average: 0, recentComments: [] })
    expect(result.current.isSubmitting).toBe(false)
    expect(result.current.isDisabled).toBe(false)
  })
})

describe('useFeedback — setRating / setComment', () => {
  it('updates selectedRating', () => {
    const { result } = renderHook(() => useFeedback())
    act(() => result.current.setRating(4))
    expect(result.current.selectedRating).toBe(4)
  })

  it('updates comment', () => {
    const { result } = renderHook(() => useFeedback())
    act(() => result.current.setComment('hello'))
    expect(result.current.comment).toBe('hello')
  })

  it('clears the rating validation error when setRating is called', async () => {
    const { result } = renderHook(() => useFeedback())
    // Trigger validation error
    await act(() => result.current.submit())
    expect(result.current.validationErrors.rating).toBeDefined()
    // Fix it
    act(() => result.current.setRating(3))
    expect(result.current.validationErrors.rating).toBeUndefined()
  })
})

describe('useFeedback — validation', () => {
  it('sets rating error when submitting without a rating', async () => {
    const { result } = renderHook(() => useFeedback())
    await act(() => result.current.submit())
    expect(result.current.validationErrors.rating).toBe(
      'Please select a rating before submitting.',
    )
    expect(mockSubmitFeedback).not.toHaveBeenCalled()
  })

  it('sets comment error when comment exceeds 500 chars', async () => {
    const { result } = renderHook(() => useFeedback())
    act(() => result.current.setRating(3))
    act(() => result.current.setComment('x'.repeat(501)))
    await act(() => result.current.submit())
    expect(result.current.validationErrors.comment).toBe(
      'Comment must be 500 characters or fewer.',
    )
    expect(mockSubmitFeedback).not.toHaveBeenCalled()
  })
})

describe('useFeedback — successful submission', () => {
  it('shows confirmation and updates summary after submit', async () => {
    const { result } = renderHook(() => useFeedback())
    act(() => result.current.setRating(5))
    act(() => result.current.setComment('fantastic'))

    await act(() => result.current.submit())

    expect(result.current.showConfirmation).toBe(true)
    expect(result.current.error).toBeNull()
    expect(result.current.summary.total).toBe(1)
    expect(result.current.summary.average).toBe(5)
    expect(result.current.summary.recentComments).toEqual(['fantastic'])
  })

  it('disables form during and after submission (cooldown)', async () => {
    const { result } = renderHook(() => useFeedback())
    act(() => result.current.setRating(3))
    await act(() => result.current.submit())
    expect(result.current.isDisabled).toBe(true)
  })

  it('resets form after 3s cooldown', async () => {
    const { result } = renderHook(() => useFeedback())
    act(() => result.current.setRating(3))
    act(() => result.current.setComment('nice'))
    await act(() => result.current.submit())

    act(() => jest.advanceTimersByTime(3000))

    expect(result.current.isDisabled).toBe(false)
    expect(result.current.showConfirmation).toBe(false)
    expect(result.current.selectedRating).toBeNull()
    expect(result.current.comment).toBe('')
  })

  it('updates backendSummary when fetchSummary returns data', async () => {
    const backend = { total: 10, average: 3.5, recentComments: ['ok'] }
    mockFetchSummary.mockResolvedValue(backend)

    const { result } = renderHook(() => useFeedback())
    act(() => result.current.setRating(4))
    await act(() => result.current.submit())

    expect(result.current.summary).toEqual(backend)
  })
})

describe('useFeedback — failed submission', () => {
  it('sets error and re-enables form on API failure', async () => {
    mockSubmitFeedback.mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useFeedback())
    act(() => result.current.setRating(2))
    await act(() => result.current.submit())

    expect(result.current.error).toBe('Network error')
    expect(result.current.isDisabled).toBe(false)
    expect(result.current.isSubmitting).toBe(false)
  })
})
