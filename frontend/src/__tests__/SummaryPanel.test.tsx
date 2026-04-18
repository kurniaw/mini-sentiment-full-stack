import { render, screen } from '@testing-library/react'
import { SummaryPanel } from '../components/sentiment/SummaryPanel'

describe('SummaryPanel', () => {
  it('shows empty state when total is 0', () => {
    render(<SummaryPanel total={0} average={0} recentComments={[]} />)
    expect(screen.getByText(/no submissions yet/i)).toBeInTheDocument()
  })

  it('does not show stats when total is 0', () => {
    render(<SummaryPanel total={0} average={0} recentComments={[]} />)
    expect(screen.queryByText(/total submissions/i)).not.toBeInTheDocument()
  })

  it('shows total, average and recent comments', () => {
    render(
      <SummaryPanel
        total={7}
        average={4.2}
        recentComments={['Great product!', 'Could be better']}
      />,
    )
    expect(screen.getByText('7')).toBeInTheDocument()
    expect(screen.getByText('4.2')).toBeInTheDocument()
    expect(screen.getByText(/total submissions/i)).toBeInTheDocument()
    expect(screen.getByText(/average rating/i)).toBeInTheDocument()
    expect(screen.getByText(/great product/i)).toBeInTheDocument()
    expect(screen.getByText(/could be better/i)).toBeInTheDocument()
  })
})
