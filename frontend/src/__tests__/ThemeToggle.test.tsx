import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeToggle } from '../components/sentiment/ThemeToggle'

// Mock useTheme so tests are self-contained
const mockToggleTheme = jest.fn()
jest.mock('../hooks/useTheme', () => ({
  useTheme: jest.fn(),
}))

import { useTheme } from '../hooks/useTheme'
const mockUseTheme = useTheme as jest.Mock

describe('ThemeToggle', () => {
  beforeEach(() => mockToggleTheme.mockReset())

  it('shows Moon icon and correct aria-label in light mode', () => {
    mockUseTheme.mockReturnValue({ theme: 'light', toggleTheme: mockToggleTheme })
    render(<ThemeToggle />)
    expect(screen.getByRole('button', { name: /switch to dark mode/i })).toBeInTheDocument()
  })

  it('shows Sun icon and correct aria-label in dark mode', () => {
    mockUseTheme.mockReturnValue({ theme: 'dark', toggleTheme: mockToggleTheme })
    render(<ThemeToggle />)
    expect(screen.getByRole('button', { name: /switch to light mode/i })).toBeInTheDocument()
  })
})
