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

  it('renders task title', () => {
    render(
      <TaskItem
        task={mockTask}
        onClick={() => {}}
        onDelete={() => {}}
        onComplete={() => {}}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('displays deadline with relative and absolute time', () => {
    render(
      <TaskItem
        task={mockTask}
        onClick={() => {}}
        onDelete={() => {}}
        onComplete={() => {}}
      />
    );

    // Should display relative time ("Due in ...")
    expect(screen.getByText(/Due in/i)).toBeInTheDocument();
    // Should display absolute formatted deadline (exact format may vary based on timezone)
    expect(screen.getByText(/Dec 31, 2025/i)).toBeInTheDocument();
  });

  it('displays priority indicator', () => {
    render(
      <TaskItem
        task={mockTask}
        onClick={() => {}}
        onDelete={() => {}}
        onComplete={() => {}}
      />
    );

    expect(screen.getByText(/high/i)).toBeInTheDocument();
  });

  it('calls onDelete when delete icon is clicked', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    render(
      <TaskItem
        task={mockTask}
        onClick={() => {}}
        onDelete={onDelete}
        onComplete={() => {}}
      />
    );

    await user.click(screen.getByLabelText('Delete task'));
    expect(onDelete).toHaveBeenCalledWith(mockTask.id);
  });

  it('calls onComplete when complete button is clicked', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();

    render(
      <TaskItem
        task={mockTask}
        onClick={() => {}}
        onDelete={() => {}}
        onComplete={onComplete}
      />
    );

    await user.click(screen.getByRole('button', { name: /complete/i }));
    expect(onComplete).toHaveBeenCalledWith(mockTask.id);
  });

  it('truncates long titles with ellipsis', () => {
    const longTitleTask = {
      ...mockTask,
      title: 'A'.repeat(200)
    };

    render(
      <TaskItem
        task={longTitleTask}
        onClick={() => {}}
        onDelete={() => {}}
        onComplete={() => {}}
      />
    );

    const title = screen.getByText(/A+/);
    expect(title.style.overflow).toBe('hidden');
    expect(title.style.textOverflow).toBe('ellipsis');
  });
});
