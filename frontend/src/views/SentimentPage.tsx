'use client'

import { useFeedback } from '../hooks/useFeedback'
import { RatingChips } from '../components/sentiment/RatingChips'
import { CommentBox } from '../components/sentiment/CommentBox'
import { SubmitButton } from '../components/sentiment/SubmitButton'
import { SummaryPanel } from '../components/sentiment/SummaryPanel'
import { ThemeToggle } from '../components/sentiment/ThemeToggle'
import { ResetButton } from '../components/sentiment/ResetButton'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle2, AlertCircle } from 'lucide-react'

const RATINGS: Record<number, string> = {
  1: 'Poor',
  2: 'Meh!',
  3: 'Average',
  4: 'Good',
  5: 'Excellent',
}

export default function SentimentPage() {
  const {
    selectedRating,
    comment,
    isSubmitting,
    isDisabled,
    showConfirmation,
    error,
    validationErrors,
    summary,
    setRating,
    setComment,
    submit,
    resetData,
  } = useFeedback()

  return (
    <div className="min-h-screen bg-background transition-colors duration-200">
      <div className="max-w-lg mx-auto px-4 py-10">

        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold">Mini Sentiment Widget</h1>
          <div className="flex items-center gap-1">
            <ResetButton onConfirm={resetData} />
            <ThemeToggle />
          </div>
        </header>

        {/* Feedback form */}
        <main className="space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-6">
              {/* Rating */}
              <div className="space-y-2">
                
                <RatingChips
                  selectedRating={selectedRating}
                  onChange={setRating}
                  disabled={isDisabled}
                  ratings={RATINGS}
                />
                {validationErrors.rating && (
                  <p className="text-xs text-destructive" role="alert">
                    {validationErrors.rating}
                  </p>
                )}
              </div>

              {/* Comment */}
              <CommentBox
                value={comment}
                onChange={setComment}
                disabled={isDisabled}
                error={validationErrors.comment}
              />

              {/* Confirmation */}
              {showConfirmation && (
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    Thank you for your feedback.
                  </AlertDescription>
                </Alert>
              )}

              {/* Error */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Submit */}
              <SubmitButton
                disabled={isDisabled}
                isSubmitting={isSubmitting}
                onClick={submit}
              />

            </CardContent>
          </Card>

          {/* Summary */}
          <SummaryPanel
            total={summary.total}
            average={summary.average}
            recentComments={summary.recentComments}
          />
        </main>

      </div>
    </div>
  )
}
