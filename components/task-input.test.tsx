import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { TaskInput } from './task-input'
import { useTaskStore } from '@/lib/store'
import { useParams, usePathname } from 'next/navigation'

// Mock the next/navigation hooks
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  usePathname: jest.fn(),
}))

// Mock the store
jest.mock('@/lib/store', () => ({
  useTaskStore: jest.fn(),
}))

describe('TaskInput', () => {
  beforeEach(() => {
    ;(useParams as jest.Mock).mockReturnValue({})
    ;(usePathname as jest.Mock).mockReturnValue('/')
    ;(useTaskStore as jest.Mock).mockReturnValue({
      addTask: jest.fn(),
      projects: [],
    })
  })

  it('renders correctly', () => {
    render(<TaskInput defaultProject={null} />)
    expect(screen.getByText('Adicionar tarefa')).toBeInTheDocument()
  })

  it('expands when "Adicionar tarefa" is clicked', () => {
    render(<TaskInput defaultProject={null} />)
    fireEvent.click(screen.getByText('Adicionar tarefa'))
    expect(screen.getByPlaceholderText('Nome da tarefa')).toBeInTheDocument()
  })

  it('adds a task when form is submitted', () => {
    const addTaskMock = jest.fn()
    ;(useTaskStore as jest.Mock).mockReturnValue({
      addTask: addTaskMock,
      projects: [],
    })
    render(<TaskInput defaultProject={null} />)
    fireEvent.click(screen.getByText('Adicionar tarefa'))
    fireEvent.change(screen.getByPlaceholderText('Nome da tarefa'), { target: { value: 'New Task' } })
    fireEvent.click(screen.getByText('Adicionar tarefa', { selector: 'button' }))
    expect(addTaskMock).toHaveBeenCalled()
  })

  it('sets due date correctly', () => {
    const addTaskMock = jest.fn()
    ;(useTaskStore as jest.Mock).mockReturnValue({
      addTask: addTaskMock,
      projects: [],
    })
    render(<TaskInput defaultProject={null} />)
    fireEvent.click(screen.getByText('Adicionar tarefa'))
    fireEvent.click(screen.getByText('Data de vencimento'))
    fireEvent.click(screen.getByText('15'))
    fireEvent.change(screen.getByPlaceholderText('Nome da tarefa'), { target: { value: 'New Task' } })
    fireEvent.click(screen.getByText('Adicionar tarefa', { selector: 'button' }))
    expect(addTaskMock).toHaveBeenCalledWith(expect.objectContaining({
      title: 'New Task',
      dueDate: expect.any(Date),
    }))
  })

  it('sets priority correctly', () => {
    const addTaskMock = jest.fn()
    ;(useTaskStore as jest.Mock).mockReturnValue({
      addTask: addTaskMock,
      projects: [],
    })
    render(<TaskInput defaultProject={null} />)
    fireEvent.click(screen.getByText('Adicionar tarefa'))
    fireEvent.click(screen.getByText('P4'))
    fireEvent.click(screen.getByText('P1 - Urgente'))
    fireEvent.change(screen.getByPlaceholderText('Nome da tarefa'), { target: { value: 'New Task' } })
    fireEvent.click(screen.getByText('Adicionar tarefa', { selector: 'button' }))
    expect(addTaskMock).toHaveBeenCalledWith(expect.objectContaining({
      title: 'New Task',
      priority: 1,
    }))
  })
})

