import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SubmitButton } from '../components/sentiment/SubmitButton'

describe('SubmitButton', () => {
  it('renders "Submit Feedback" in idle state', () => {
    render(<SubmitButton disabled={false} isSubmitting={false} onClick={jest.fn()} />)
    expect(screen.getByRole('button', { name: /submit feedback/i })).toBeInTheDocument()
  })

  it('is disabled when isSubmitting is true', () => {
    render(<SubmitButton disabled={false} isSubmitting={true} onClick={jest.fn()} />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('calls onClick when clicked in idle state', async () => {
    const onClick = jest.fn()
    render(<SubmitButton disabled={false} isSubmitting={false} onClick={onClick} />)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', async () => {
    const onClick = jest.fn()
    render(<SubmitButton disabled={true} isSubmitting={false} onClick={onClick} />)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })
})
