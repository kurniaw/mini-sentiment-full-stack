import { validateFeedbackForm } from '../utils/validation'

describe('validateFeedbackForm', () => {
  describe('rating validation', () => {
    it('fails when rating is null', () => {
      const result = validateFeedbackForm(null, '')
      expect(result.valid).toBe(false)
      expect(result.errors.rating).toBe('Please select a rating before submitting.')
    })

    it('passes with a valid rating', () => {
      const result = validateFeedbackForm(3, '')
      expect(result.valid).toBe(true)
      expect(result.errors.rating).toBeUndefined()
    })
  })

  describe('comment validation', () => {
    it('passes with an empty comment', () => {
      const result = validateFeedbackForm(1, '')
      expect(result.errors.comment).toBeUndefined()
    })

    it('passes with exactly 500 characters', () => {
      const result = validateFeedbackForm(1, 'a'.repeat(500))
      expect(result.valid).toBe(true)
      expect(result.errors.comment).toBeUndefined()
    })

    it('fails with 501 characters', () => {
      const result = validateFeedbackForm(1, 'a'.repeat(501))
      expect(result.valid).toBe(false)
      expect(result.errors.comment).toBe('Comment must be 500 characters or fewer.')
    })
  })

  describe('combined', () => {
    it('returns both errors when rating is null and comment is too long', () => {
      const result = validateFeedbackForm(null, 'x'.repeat(501))
      expect(result.valid).toBe(false)
      expect(result.errors.rating).toBeDefined()
      expect(result.errors.comment).toBeDefined()
    })

    it('returns no errors for a valid rating and comment', () => {
      const result = validateFeedbackForm(5, 'Great experience!')
      expect(result.valid).toBe(true)
      expect(result.errors).toEqual({})
    })
  })
})
