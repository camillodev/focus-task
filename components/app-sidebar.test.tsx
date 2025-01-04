import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppSidebar } from './app-sidebar';
import { useTaskStore } from '@/lib/store';

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('AppSidebar', () => {
  beforeEach(() => {
    useTaskStore.getState().tasks = [];
    useTaskStore.getState().projects = [];
  });

  it('renders correctly', () => {
    render(<AppSidebar />);
    expect(screen.getByText('Buscar')).toBeInTheDocument();
    expect(screen.getByText('Entrada')).toBeInTheDocument();
    expect(screen.getByText('Hoje')).toBeInTheDocument();
  });

  it('adds a new project', () => {
    render(<AppSidebar />);
    fireEvent.click(screen.getByLabelText('Adicionar projeto'));
    fireEvent.change(screen.getByPlaceholderText('Nome do projeto'), { target: { value: 'New Project' } });
    fireEvent.click(screen.getByText('Adicionar'));
    expect(useTaskStore.getState().projects).toHaveLength(1);
    expect(useTaskStore.getState().projects[0].name).toBe('New Project');
  });

  it('edits a project', () => {
    useTaskStore.getState().projects = [{ id: 'project1', name: 'Test Project', color: 'red' }];
    render(<AppSidebar />);
    fireEvent.click(screen.getByLabelText('Mais opções'));
    fireEvent.click(screen.getByText('Editar'));
    fireEvent.change(screen.getByDisplayValue('Test Project'), { target: { value: 'Updated Project' } });
    fireEvent.click(screen.getByText('Salvar'));
    expect(useTaskStore.getState().projects[0].name).toBe('Updated Project');
  });

  it('deletes a project', () => {
    useTaskStore.getState().projects = [{ id: 'project1', name: 'Test Project', color: 'red' }];
    render(<AppSidebar />);
    fireEvent.click(screen.getByLabelText('Mais opções'));
    fireEvent.click(screen.getByText('Excluir'));
    expect(useTaskStore.getState().projects).toHaveLength(0);
  });
});

