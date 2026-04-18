import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CommentBox } from '../components/sentiment/CommentBox'

describe('CommentBox', () => {

  it('shows the character counter', () => {
    render(<CommentBox value="hello" onChange={jest.fn()} disabled={false} />)
    expect(screen.getByText('295/300')).toBeInTheDocument()
  })

  it('calls onChange when the user types', async () => {
    const onChange = jest.fn()
    render(<CommentBox value="" onChange={onChange} disabled={false} />)
    await userEvent.type(screen.getByRole('textbox'), 'hi')
    expect(onChange).toHaveBeenCalled()
  })

  it('shows the error message when error prop is provided', () => {
    render(<CommentBox value="" onChange={jest.fn()} disabled={false} error="Too long" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Too long')
  })

  it('disables the textarea when disabled is true', () => {
    render(<CommentBox value="" onChange={jest.fn()} disabled={true} />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })
})
