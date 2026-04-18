import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface SubmitButtonProps {
  disabled: boolean
  isSubmitting: boolean
  onClick: () => void
}

export function SubmitButton({ disabled, isSubmitting, onClick }: SubmitButtonProps) {
  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={disabled || isSubmitting}
      className="w-full"
    >
      {isSubmitting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Submitting…
        </>
      ) : (
        'Submit Feedback'
      )}
    </Button>
  )
}
