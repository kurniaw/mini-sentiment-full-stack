import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

const MAX_LENGTH = 300

interface CommentBoxProps {
  value: string
  onChange: (value: string) => void
  disabled: boolean
  error?: string
}

export function CommentBox({ value, onChange, disabled, error }: CommentBoxProps) {
  const remaining = MAX_LENGTH - value.length
  const isNearLimit = remaining <= 50

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="comment">
        Comment{' '}
        <span className="text-muted-foreground font-normal">(optional)</span>
      </Label>
      <Textarea
        id="comment"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        maxLength={MAX_LENGTH}
        rows={3}
        placeholder="Share your thoughts..."
        aria-describedby={error ? 'comment-error' : 'comment-hint'}
        className={cn(
          'resize-none',
          error && 'border-destructive focus-visible:ring-destructive',
        )}
      />
      <div className="flex justify-between text-xs">
        {error ? (
          <span id="comment-error" className="text-destructive" role="alert">
            {error}
          </span>
        ) : (
          <span id="comment-hint" />
        )}
        <span className={cn(
          'text-muted-foreground',
          isNearLimit && 'text-amber-500 font-medium',
        )}>
          {remaining}/{MAX_LENGTH}
        </span>
      </div>
    </div>
  )
}
