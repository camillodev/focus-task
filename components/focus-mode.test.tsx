import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { FocusMode } from './focus-mode'
import { useTaskStore } from '@/lib/store'

// Mock the store
jest.mock('@/lib/store', () => ({
  useTaskStore: jest.fn(),
}))

describe('FocusMode', () => {
  const mockTasks = [
    { id: '1', title: 'Task 1', completed: false },
    { id: '2', title: 'Task 2', completed: false },
  ]

  beforeEach(() => {
    jest.useFakeTimers()
    ;(useTaskStore as jest.Mock).mockReturnValue({
      focusState: {
        isActive: false,
        currentTaskId: null,
        settings: {
          workDuration: 25,
          breakDuration: 5,
          longBreakDuration: 15,
          sessionsUntilLongBreak: 4,
        },
        currentSession: 0,
        isBreak: false,
      },
      focusSettings: {
        workDuration: 25,
        breakDuration: 5,
        longBreakDuration: 15,
        sessionsUntilLongBreak: 4,
      },
      setFocusSettings: jest.fn(),
      startFocusMode: jest.fn(),
      stopFocusMode: jest.fn(),
      skipTask: jest.fn(),
      completeCurrentTask: jest.fn(),
    })
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders correctly', () => {
    render(<FocusMode tasks={mockTasks} />)
    expect(screen.getByText('Focus Mode')).toBeInTheDocument()
  })

  it('starts focus mode when a task is selected', () => {
    render(<FocusMode tasks={mockTasks} />)
    fireEvent.click(screen.getByText('Task 1'))
    expect(useTaskStore().startFocusMode).toHaveBeenCalledWith('1')
  })

  it('displays timer correctly', () => {
    ;(useTaskStore as jest.Mock).mockReturnValue({
      ...useTaskStore(),
      focusState: {
        ...useTaskStore().focusState,
        isActive: true,
        currentTaskId: '1',
      },
    })
    render(<FocusMode tasks={mockTasks} />)
    expect(screen.getByText('25:00')).toBeInTheDocument()
  })

  it('starts and pauses timer', () => {
    ;(useTaskStore as jest.Mock).mockReturnValue({
      ...useTaskStore(),
      focusState: {
        ...useTaskStore().focusState,
        isActive: true,
        currentTaskId: '1',
      },
    })
    render(<FocusMode tasks={mockTasks} />)
    fireEvent.click(screen.getByText('Start'))
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    expect(screen.getByText('24:59')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Pause'))
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    expect(screen.getByText('24:59')).toBeInTheDocument()
  })
})

