export interface Submission {
  rating: number
  comment: string
  timestamp: number
}

export interface BackendSummary {
  total: number
  average: number
  recentComments: string[]
}

export interface FeedbackState {
  selectedRating: number | null
  comment: string
  submissions: Submission[]
  isSubmitting: boolean
  isDisabled: boolean
  showConfirmation: boolean
  error: string | null
  backendSummary: BackendSummary | null
}

export type FeedbackAction =
  | { type: 'SET_RATING'; payload: number }
  | { type: 'SET_COMMENT'; payload: string }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS'; payload: Submission }
  | { type: 'SUBMIT_ERROR'; payload: string }
  | { type: 'COOLDOWN_END' }
  | { type: 'SET_BACKEND_SUMMARY'; payload: BackendSummary | null }
  | { type: 'RESET_DATA' }

export interface ValidationResult {
  valid: boolean
  errors: Record<string, string>
}

export type Theme = 'light' | 'dark'
