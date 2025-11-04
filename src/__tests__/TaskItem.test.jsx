/**
 * Tests for TaskItem component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskItem from '../components/TaskItem';

describe('TaskItem', () => {
  const mockTask = {
    id: 'test-id-123',
    title: 'Test Task',
    description: 'Test description',
    deadline: '2025-12-31T23:59:00Z',
    priority: 1,
    isCompleted: false,
    createdAt: '2025-01-01T00:00:00Z',
    lastModified: '2025-01-01T00:00:00Z',
    schemaVersion: 1
  };

  it('renders task title and description', () => {
    render(
      <TaskItem
        task={mockTask}
        onEdit={() => {}}
        onDelete={() => {}}
        onComplete={() => {}}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('displays deadline in local time format', () => {
    render(
      <TaskItem
        task={mockTask}
        onEdit={() => {}}
        onDelete={() => {}}
        onComplete={() => {}}
      />
    );

    // Should display formatted deadline (exact format may vary based on timezone)
    expect(screen.getByText(/Dec 31, 2025/i)).toBeInTheDocument();
  });

  it('displays priority indicator', () => {
    render(
      <TaskItem
        task={mockTask}
        onEdit={() => {}}
        onDelete={() => {}}
        onComplete={() => {}}
      />
    );

    expect(screen.getByText(/high/i)).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();

    render(
      <TaskItem
        task={mockTask}
        onEdit={onEdit}
        onDelete={() => {}}
        onComplete={() => {}}
      />
    );

    await user.click(screen.getByRole('button', { name: /edit/i }));
    expect(onEdit).toHaveBeenCalledWith(mockTask.id);
  });

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(
      <TaskItem
        task={mockTask}
        onEdit={() => {}}
        onDelete={onDelete}
        onComplete={() => {}}
      />
    );

    await user.click(screen.getByRole('button', { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledWith(mockTask.id);
  });

  it('calls onComplete when complete button is clicked', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();

    render(
      <TaskItem
        task={mockTask}
        onEdit={() => {}}
        onDelete={() => {}}
        onComplete={onComplete}
      />
    );

    await user.click(screen.getByRole('button', { name: /complete/i }));
    expect(onComplete).toHaveBeenCalledWith(mockTask.id);
  });

  it('truncates long descriptions with ellipsis', () => {
    const longDescTask = {
      ...mockTask,
      description: 'A'.repeat(200)
    };

    render(
      <TaskItem
        task={longDescTask}
        onEdit={() => {}}
        onDelete={() => {}}
        onComplete={() => {}}
      />
    );

    const description = screen.getByText(/A+/);
    expect(description.style.overflow).toBe('hidden');
    expect(description.style.textOverflow).toBe('ellipsis');
  });
});
