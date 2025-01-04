import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { FocusModeButton } from './focus-mode-button'
import { useTaskStore } from '@/lib/store'
import { useRouter, usePathname } from 'next/navigation'

// Mock the next/navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}))

// Mock the store
jest.mock('@/lib/store', () => ({
  useTaskStore: jest.fn(),
}))

describe('FocusModeButton', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() })
    ;(usePathname as jest.Mock).mockReturnValue('/')
    ;(useTaskStore as jest.Mock).mockReturnValue({
      tasks: [],
      projects: [],
    })
  })

  it('renders correctly', () => {
    render(<FocusModeButton />)
    expect(screen.getByText('Focus Mode')).toBeInTheDocument()
  })

  it('is disabled when there are no uncompleted tasks', () => {
    render(<FocusModeButton />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('is enabled when there are uncompleted tasks', () => {
    ;(useTaskStore as jest.Mock).mockReturnValue({
      tasks: [{ id: '1', title: 'Task 1', completed: false }],
      projects: [],
    })
    render(<FocusModeButton />)
    expect(screen.getByRole('button')).not.toBeDisabled()
  })

  it('navigates to focus page when clicked', () => {
    const pushMock = jest.fn()
    ;(useRouter as jest.Mock).mockReturnValue({ push: pushMock })
    ;(useTaskStore as jest.Mock).mockReturnValue({
      tasks: [{ id: '1', title: 'Task 1', completed: false }],
      projects: [],
    })
    render(<FocusModeButton />)
    fireEvent.click(screen.getByRole('button'))
    expect(pushMock).toHaveBeenCalledWith('/focus')
  })
})

