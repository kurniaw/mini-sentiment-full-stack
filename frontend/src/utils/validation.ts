import type { ValidationResult } from '../types/feedbackType'

const MAX_COMMENT_LENGTH = 500

export function validateFeedbackForm(
  rating: number | null,
  comment: string,
): ValidationResult {
  const errors: Record<string, string> = {}

  if (rating === null) {
    errors.rating = 'Please select a rating before submitting.'
  }

  if (comment.length > MAX_COMMENT_LENGTH) {
    errors.comment = `Comment must be ${MAX_COMMENT_LENGTH} characters or fewer.`
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}
