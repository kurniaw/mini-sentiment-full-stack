import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface SummaryPanelProps {
  total: number
  average: number
  recentComments: string[]
}

export function SummaryPanel({ total, average, recentComments }: SummaryPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <p className="text-sm text-muted-foreground italic">
            No submissions yet. Be the first!
          </p>
        ) : (
          <div>
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardContent className="p-3 text-center">
                  <p className="text-2xl font-bold">{total}</p>
                  <p className="text-xs">Total Submissions</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <p className="text-2xl font-bold text-primary">
                    {average.toFixed(1)}
                  </p>
                  <p className="text-xs">Average Rating</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent comments */}
            {recentComments.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider">
                  Recent Comments
                </p>
                <ul className="space-y-2">
                  {recentComments.map((comment, i) => (
                    <li key={i}>
                      <Card>
                        <CardContent className="px-3 py-2 text-sm line-clamp-2">
                          &ldquo;{comment}&rdquo;
                        </CardContent>
                      </Card>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* End Recent Comment */}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
