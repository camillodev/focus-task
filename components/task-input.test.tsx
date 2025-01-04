import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskInput } from './task-input';
import { useTaskStore } from '@/lib/store';

jest.mock('next/navigation', () => ({
  useParams: () => ({}),
  usePathname: () => '/',
}));

describe('TaskInput', () => {
  beforeEach(() => {
    useTaskStore.getState().tasks = [];
    useTaskStore.getState().projects = [];
  });

  it('renders correctly', () => {
    render(<TaskInput defaultProject={null} />);
    expect(screen.getByText('Adicionar tarefa')).toBeInTheDocument();
  });

  it('expands when "Adicionar tarefa" is clicked', () => {
    render(<TaskInput defaultProject={null} />);
    fireEvent.click(screen.getByText('Adicionar tarefa'));
    expect(screen.getByPlaceholderText('Nome da tarefa')).toBeInTheDocument();
  });

  it('adds a task when form is submitted', () => {
    render(<TaskInput defaultProject={null} />);
    fireEvent.click(screen.getByText('Adicionar tarefa'));
    fireEvent.change(screen.getByPlaceholderText('Nome da tarefa'), { target: { value: 'New Task' } });
    fireEvent.click(screen.getByText('Adicionar tarefa', { selector: 'button' }));
    expect(useTaskStore.getState().tasks).toHaveLength(1);
    expect(useTaskStore.getState().tasks[0].title).toBe('New Task');
  });

  it('sets due date correctly', () => {
    render(<TaskInput defaultProject={null} />);
    fireEvent.click(screen.getByText('Adicionar tarefa'));
    fireEvent.click(screen.getByText('Data de vencimento'));
    fireEvent.click(screen.getByText('15'));
    fireEvent.change(screen.getByPlaceholderText('Nome da tarefa'), { target: { value: 'New Task' } });
    fireEvent.click(screen.getByText('Adicionar tarefa', { selector: 'button' }));
    expect(useTaskStore.getState().tasks[0].dueDate).toBeDefined();
  });

  it('sets priority correctly', () => {
    render(<TaskInput defaultProject={null} />);
    fireEvent.click(screen.getByText('Adicionar tarefa'));
    fireEvent.click(screen.getByText('P4'));
    fireEvent.click(screen.getByText('P1 - Urgente'));
    fireEvent.change(screen.getByPlaceholderText('Nome da tarefa'), { target: { value: 'New Task' } });
    fireEvent.click(screen.getByText('Adicionar tarefa', { selector: 'button' }));
    expect(useTaskStore.getState().tasks[0].priority).toBe(1);
  });
});

