import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RatingChips } from '../components/sentiment/RatingChips'

const RATINGS = { 1: 'Terrible', 2: 'Poor', 3: 'Okay', 4: 'Good', 5: 'Excellent' }

describe('RatingChips', () => {
  it('renders a button for each rating', () => {
    render(
      <RatingChips selectedRating={null} onChange={jest.fn()} disabled={false} ratings={RATINGS} />,
    )
    for (const value of Object.keys(RATINGS)) {
      expect(screen.getByRole('button', { name: new RegExp(`Rate ${value}`) })).toBeInTheDocument()
    }
  })

  it('calls onChange with the clicked rating value', async () => {
    const onChange = jest.fn()
    render(
      <RatingChips selectedRating={null} onChange={onChange} disabled={false} ratings={RATINGS} />,
    )
    await userEvent.click(screen.getByRole('button', { name: /Rate 3/ }))
    expect(onChange).toHaveBeenCalledWith(3)
  })

  it('does not call onChange when disabled', async () => {
    const onChange = jest.fn()
    render(
      <RatingChips selectedRating={null} onChange={onChange} disabled={true} ratings={RATINGS} />,
    )
    await userEvent.click(screen.getByRole('button', { name: /Rate 1/ }))
    expect(onChange).not.toHaveBeenCalled()
  })
})
