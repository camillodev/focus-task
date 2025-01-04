import { useTaskStore, projectColors, getPriorityDetails } from './store';
import { act } from '@testing-library/react';

describe('useTaskStore', () => {
  it('should add a task', () => {
    const { addTask, tasks } = useTaskStore.getState();
    act(() => {
      addTask({
        title: 'Test Task',
        description: 'Test Description',
        projectId: null,
        priority: 4,
      });
    });
    expect(tasks).toHaveLength(1);
    expect(tasks[0].title).toBe('Test Task');
  });

  it('should edit a task', () => {
    const { addTask, editTask, tasks } = useTaskStore.getState();
    let taskId: string;
    act(() => {
      taskId = addTask({
        title: 'Test Task',
        description: 'Test Description',
        projectId: null,
        priority: 4,
      }).id;
    });
    act(() => {
      editTask(taskId, { title: 'Updated Task' });
    });
    expect(tasks[0].title).toBe('Updated Task');
  });

  it('should toggle a task', () => {
    const { addTask, toggleTask, tasks } = useTaskStore.getState();
    let taskId: string;
    act(() => {
      taskId = addTask({
        title: 'Test Task',
        description: 'Test Description',
        projectId: null,
        priority: 4,
      }).id;
    });
    act(() => {
      toggleTask(taskId);
    });
    expect(tasks[0].completed).toBe(true);
  });

  it('should delete a task', () => {
    const { addTask, deleteTask, tasks } = useTaskStore.getState();
    let taskId: string;
    act(() => {
      taskId = addTask({
        title: 'Test Task',
        description: 'Test Description',
        projectId: null,
        priority: 4,
      }).id;
    });
    act(() => {
      deleteTask(taskId);
    });
    expect(tasks).toHaveLength(0);
  });

  it('should add a project', () => {
    const { addProject, projects } = useTaskStore.getState();
    act(() => {
      addProject('Test Project', 'red');
    });
    expect(projects).toHaveLength(1);
    expect(projects[0].name).toBe('Test Project');
  });

  it('should edit a project', () => {
    const { addProject, editProject, projects } = useTaskStore.getState();
    let projectId: string;
    act(() => {
      projectId = addProject('Test Project', 'red').id;
    });
    act(() => {
      editProject(projectId, { name: 'Updated Project' });
    });
    expect(projects[0].name).toBe('Updated Project');
  });

  it('should delete a project', () => {
    const { addProject, deleteProject, projects } = useTaskStore.getState();
    let projectId: string;
    act(() => {
      projectId = addProject('Test Project', 'red').id;
    });
    act(() => {
      deleteProject(projectId);
    });
    expect(projects).toHaveLength(0);
  });
});

describe('projectColors', () => {
  it('should have the correct colors', () => {
    expect(projectColors).toEqual([
      { name: 'Vermelho', value: 'red' },
      { name: 'Laranja', value: 'orange' },
      { name: 'Amarelo', value: 'yellow' },
      { name: 'Verde', value: 'green' },
      { name: 'Azul', value: 'blue' },
      { name: 'Índigo', value: 'indigo' },
      { name: 'Violeta', value: 'violet' },
      { name: 'Rosa', value: 'pink' },
    ]);
  });
});

describe('getPriorityDetails', () => {
  it('should return correct details for priority 1', () => {
    expect(getPriorityDetails(1)).toEqual({
      color: 'bg-red-500',
      description: 'Urgente',
      textColor: 'text-red-500',
    });
  });

  it('should return correct details for priority 4', () => {
    expect(getPriorityDetails(4)).toEqual({
      color: 'bg-blue-500',
      description: 'Baixa prioridade',
      textColor: 'text-blue-500',
    });
  });
});

