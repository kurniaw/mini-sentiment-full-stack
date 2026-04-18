import { Toggle } from '@/components/ui/toggle'
import { cn } from '@/lib/utils'

interface RatingChipsProps {
  selectedRating: number | null
  onChange: (rating: number) => void
  ratings: Record<number, string>
  disabled: boolean
}

export function RatingChips({ selectedRating, onChange, disabled, ratings }: RatingChipsProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex justify-between w-full text-xs text-muted-foreground px-1">
        <span>Poor</span>
        <span>Excellent</span>
      </div>
      <div className="flex gap-2 flex-wrap justify-center" role="group" aria-label="Rating">
      {Object.entries(ratings).map(([raw, label]) => {
        const value = Number(raw)
        const isSelected = selectedRating === value
        return (
          <Toggle
            key={value}
            pressed={isSelected}
            onPressedChange={() => onChange(value)}
            disabled={disabled}
            aria-label={`Rate ${value} - ${label}`}
            className={cn(
              'w-12 h-12 rounded-full text-sm font-semibold transition-all duration-200',
              'border-2',
              isSelected
                ? 'border-blue-500 bg-blue-500 text-blue-500 ring-2 ring-blue-300 ring-offset-2 scale-110'
                : 'border-blue-200 hover:border-blue-400 hover:text-blue-600',
            )}
          >
            {value}
          </Toggle>
        )
      })}
      </div>
    </div>
  )
}
