/**
 * Tests for TaskList component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskList from '../components/TaskList';

describe('TaskList', () => {
  const mockTasks = [
    {
      id: 'task-1',
      title: 'First Task',
      description: 'First description',
      deadline: '2025-12-31T23:59:00Z',
      priority: 1,
      isCompleted: false,
      createdAt: '2025-01-01T00:00:00Z',
      lastModified: '2025-01-01T00:00:00Z',
      schemaVersion: 1
    },
    {
      id: 'task-2',
      title: 'Second Task',
      description: 'Second description',
      deadline: '2025-11-30T12:00:00Z',
      priority: 2,
      isCompleted: false,
      createdAt: '2025-01-01T00:00:00Z',
      lastModified: '2025-01-01T00:00:00Z',
      schemaVersion: 1
    }
  ];

  it('renders all tasks', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onDelete={() => {}}
        onComplete={() => {}}
        onAddTask={() => {}}
      />
    );

    expect(screen.getByText('First Task')).toBeInTheDocument();
    expect(screen.getByText('Second Task')).toBeInTheDocument();
  });

  it('always renders AddTaskBlock even when list is empty', () => {
    render(
      <TaskList
        tasks={[]}
        onDelete={() => {}}
        onComplete={() => {}}
        onAddTask={() => {}}
      />
    );

    expect(screen.getByText(/add new task/i)).toBeInTheDocument();
  });

  it('passes callbacks to TaskItem components', () => {
    const onDelete = vi.fn();
    const onComplete = vi.fn();

    render(
      <TaskList
        tasks={mockTasks}
        onDelete={onDelete}
        onComplete={onComplete}
        onAddTask={() => {}}
      />
    );

    // Verify all tasks are rendered (callbacks will be tested in TaskItem tests)
    expect(screen.getAllByLabelText('Delete task')).toHaveLength(2);
    expect(screen.getAllByRole('button', { name: /complete/i })).toHaveLength(2);
  });

  it('renders tasks in order provided', () => {
    render(
      <TaskList
        tasks={mockTasks}
        onDelete={() => {}}
        onComplete={() => {}}
        onAddTask={() => {}}
      />
    );

    const titles = screen.getAllByRole('heading', { level: 3 });
    expect(titles[0]).toHaveTextContent('First Task');
    expect(titles[1]).toHaveTextContent('Second Task');
  });

  it('calls onAddTask when AddTaskBlock is clicked', async () => {
    const user = userEvent.setup();
    const onAddTask = vi.fn();

    render(
      <TaskList
        tasks={mockTasks}
        onDelete={() => {}}
        onComplete={() => {}}
        onAddTask={onAddTask}
      />
    );

    await user.click(screen.getByRole('button', { name: /add new task/i }));
    expect(onAddTask).toHaveBeenCalled();
  });
});
