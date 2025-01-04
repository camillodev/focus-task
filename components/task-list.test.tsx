import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskList } from './task-list';
import { useTaskStore } from '@/lib/store';

// Mock the DragDropContext
jest.mock('@hello-pangea/dnd', () => ({
  DragDropContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Droppable: ({ children }: { children: React.ReactNode }) => <div>{children({})}</div>,
  Draggable: ({ children }: { children: React.ReactNode }) => <div>{children({})}</div>,
}));

describe('TaskList', () => {
  beforeEach(() => {
    useTaskStore.getState().tasks = [];
  });

  it('renders tasks correctly', () => {
    const tasks = [
      { id: '1', title: 'Task 1', completed: false, priority: 4, projectId: null },
      { id: '2', title: 'Task 2', completed: true, priority: 2, projectId: 'project1' },
    ];
    render(<TaskList tasks={tasks} />);

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  it('toggles task completion', () => {
    const tasks = [
      { id: '1', title: 'Task 1', completed: false, priority: 4, projectId: null },
    ];
    render(<TaskList tasks={tasks} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(useTaskStore.getState().tasks[0].completed).toBe(true);
  });

  it('opens edit dialog when edit option is clicked', () => {
    const tasks = [
      { id: '1', title: 'Task 1', completed: false, priority: 4, projectId: null },
    ];
    render(<TaskList tasks={tasks} />);

    const moreButton = screen.getByRole('button', { name: /more/i });
    fireEvent.click(moreButton);

    const editOption = screen.getByText('Editar');
    fireEvent.click(editOption);

    expect(screen.getByText('Editar Tarefa')).toBeInTheDocument();
  });

  it('deletes task when delete option is clicked', () => {
    const tasks = [
      { id: '1', title: 'Task 1', completed: false, priority: 4, projectId: null },
    ];
    render(<TaskList tasks={tasks} />);

    const moreButton = screen.getByRole('button', { name: /more/i });
    fireEvent.click(moreButton);

    const deleteOption = screen.getByText('Excluir');
    fireEvent.click(deleteOption);

    expect(useTaskStore.getState().tasks).toHaveLength(0);
  });
});

