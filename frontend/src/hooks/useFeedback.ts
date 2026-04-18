import { useReducer, useRef, useState, useCallback } from 'react'
import type { FeedbackState, FeedbackAction, Submission, BackendSummary } from '../types/feedbackType'
import { validateFeedbackForm } from '../utils/validation'
import { submitFeedback, fetchSummary, resetData as apiResetData } from '../utils/api'

const initialState: FeedbackState = {
  selectedRating: null,
  comment: '',
  submissions: [],
  isSubmitting: false,
  isDisabled: false,
  showConfirmation: false,
  error: null,
  backendSummary: null,
}

function feedbackReducer(
  state: FeedbackState,
  action: FeedbackAction,
): FeedbackState {
  switch (action.type) {
    case 'SET_RATING':
      return { ...state, selectedRating: action.payload }

    case 'SET_COMMENT':
      return { ...state, comment: action.payload }

    case 'SUBMIT_START':
      return {
        ...state,
        isSubmitting: true,
        isDisabled: true,
        error: null,
        showConfirmation: false,
      }

    case 'SUBMIT_SUCCESS': {
      const submissions = [action.payload, ...state.submissions]
      return {
        ...state,
        isSubmitting: false,
        showConfirmation: true,
        submissions,
      }
    }

    case 'SUBMIT_ERROR':
      return {
        ...state,
        isSubmitting: false,
        isDisabled: false,
        error: action.payload,
      }

    case 'COOLDOWN_END':
      return {
        ...state,
        isDisabled: false,
        showConfirmation: false,
        selectedRating: null,
        comment: '',
      }

    case 'SET_BACKEND_SUMMARY':
      return { ...state, backendSummary: action.payload }

    case 'RESET_DATA':
      return { ...initialState }

    default:
      return state
  }
}

function computeSummary(
  submissions: Submission[],
  backendSummary: BackendSummary | null,
) {
  if (backendSummary) {
    return backendSummary
  }

  const total = submissions.length
  const average =
    total === 0
      ? 0
      : Math.round(
          (submissions.reduce((sum, s) => sum + s.rating, 0) / total) * 10,
        ) / 10
  const recentComments = submissions
    .slice(0, 3)
    .map((s) => s.comment)
    .filter(Boolean)

  return { total, average, recentComments }
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useFeedback() {
  const [state, dispatch] = useReducer(feedbackReducer, initialState)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const cooldownRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const setRating = useCallback((rating: number) => {
    dispatch({ type: 'SET_RATING', payload: rating })
    setValidationErrors((prev) => {
      const { rating: _, ...rest } = prev
      return rest
    })
  }, [])

  const setComment = useCallback((comment: string) => {
    dispatch({ type: 'SET_COMMENT', payload: comment })
    setValidationErrors((prev) => {
      const { comment: _, ...rest } = prev
      return rest
    })
  }, [])

  const submit = useCallback(async () => {
    const { selectedRating, comment } = state
    const { valid, errors } = validateFeedbackForm(selectedRating, comment)

    if (!valid) {
      setValidationErrors(errors)
      return
    }

    dispatch({ type: 'SUBMIT_START' })

    try {
      await submitFeedback(selectedRating!, comment)

      const submission: Submission = {
        rating: selectedRating!,
        comment,
        timestamp: Date.now(),
      }
      dispatch({ type: 'SUBMIT_SUCCESS', payload: submission })

      // Refresh backend summary if we're in backend mode
      const summary = await fetchSummary()
      if (summary) {
        dispatch({ type: 'SET_BACKEND_SUMMARY', payload: summary })
      }
    } catch (err) {
      dispatch({
        type: 'SUBMIT_ERROR',
        payload: err instanceof Error ? err.message : 'Submission failed.',
      })
      return
    }

    // 3-second cooldown
    if (cooldownRef.current) clearTimeout(cooldownRef.current)
    cooldownRef.current = setTimeout(() => {
      dispatch({ type: 'COOLDOWN_END' })
    }, 3000)
  }, [state])

  const resetData = useCallback(async () => {
    await apiResetData()
    dispatch({ type: 'RESET_DATA' })
  }, [])

  const summary = computeSummary(state.submissions, state.backendSummary)

  return {
    selectedRating: state.selectedRating,
    comment: state.comment,
    isSubmitting: state.isSubmitting,
    isDisabled: state.isDisabled,
    showConfirmation: state.showConfirmation,
    error: state.error,
    validationErrors,
    summary,
    setRating,
    setComment,
    submit,
    resetData,
  }
}
