import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskEditDialog } from './task-edit-dialog';
import { useTaskStore } from '@/lib/store';

describe('TaskEditDialog', () => {
  const mockTask = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    completed: false,
    priority: 4,
    projectId: null,
    order: 0,
  };

  const mockOnOpenChange = jest.fn();

  beforeEach(() => {
    useTaskStore.getState().tasks = [mockTask];
    useTaskStore.getState().projects = [];
  });

  it('renders correctly', () => {
    render(<TaskEditDialog task={mockTask} open={true} onOpenChange={mockOnOpenChange} />);
    expect(screen.getByText('Editar Tarefa')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
  });

  it('updates task when form is submitted', () => {
    render(<TaskEditDialog task={mockTask} open={true} onOpenChange={mockOnOpenChange} />);
    fireEvent.change(screen.getByDisplayValue('Test Task'), { target: { value: 'Updated Task' } });
    fireEvent.click(screen.getByText('Salvar'));
    expect(useTaskStore.getState().tasks[0].title).toBe('Updated Task');
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('changes priority correctly', () => {
    render(<TaskEditDialog task={mockTask} open={true} onOpenChange={mockOnOpenChange} />);
    fireEvent.click(screen.getByText('P4 - Baixa prioridade'));
    fireEvent.click(screen.getByText('P1 - Urgente'));
    fireEvent.click(screen.getByText('Salvar'));
    expect(useTaskStore.getState().tasks[0].priority).toBe(1);
  });

  it('changes project correctly', () => {
    useTaskStore.getState().projects = [{ id: 'project1', name: 'Test Project', color: 'red' }];
    render(<TaskEditDialog task={mockTask} open={true} onOpenChange={mockOnOpenChange} />);
    fireEvent.click(screen.getByText('Entrada'));
    fireEvent.click(screen.getByText('Test Project'));
    fireEvent.click(screen.getByText('Salvar'));
    expect(useTaskStore.getState().tasks[0].projectId).toBe('project1');
  });
});

