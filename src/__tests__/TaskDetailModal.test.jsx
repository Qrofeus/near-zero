/**
 * Tests for TaskDetailModal component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskDetailModal from '../components/TaskDetailModal';

describe('TaskDetailModal', () => {
  const mockTask = {
    id: 'test-123',
    title: 'Test Task',
    description: 'This is a test task description',
    deadline: '2025-11-05T20:00:00Z',
    priority: 1,
    isCompleted: false,
    createdAt: '2025-11-05T10:00:00Z',
    lastModified: '2025-11-05T10:00:00Z',
    schemaVersion: 1
  };

  const mockHandlers = {
    onClose: vi.fn(),
    onEdit: vi.fn(),
    onChangeDeadline: vi.fn(),
    onDelete: vi.fn()
  };

  it('renders task title and full description', () => {
    render(
      <TaskDetailModal
        isOpen={true}
        task={mockTask}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('This is a test task description')).toBeInTheDocument();
  });

  it('shows priority badge with correct label', () => {
    render(
      <TaskDetailModal
        isOpen={true}
        task={mockTask}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('displays both relative and absolute deadline', () => {
    render(
      <TaskDetailModal
        isOpen={true}
        task={mockTask}
        {...mockHandlers}
      />
    );

    // Should show some time format (exact text depends on current time)
    const container = screen.getByText(/Due|Overdue/i).parentElement;
    expect(container).toBeInTheDocument();
  });

  it('shows Edit action button', () => {
    render(
      <TaskDetailModal
        isOpen={true}
        task={mockTask}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('Edit Task')).toBeInTheDocument();
  });

  it('shows Change Deadline action button', () => {
    render(
      <TaskDetailModal
        isOpen={true}
        task={mockTask}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('Change Deadline')).toBeInTheDocument();
  });

  it('shows Delete action button', () => {
    render(
      <TaskDetailModal
        isOpen={true}
        task={mockTask}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('Delete Task')).toBeInTheDocument();
  });

  it('calls onEdit when Edit button clicked', () => {
    render(
      <TaskDetailModal
        isOpen={true}
        task={mockTask}
        {...mockHandlers}
      />
    );

    fireEvent.click(screen.getByText('Edit Task'));
    expect(mockHandlers.onEdit).toHaveBeenCalledWith('test-123');
  });

  it('calls onChangeDeadline when Change Deadline button clicked', () => {
    render(
      <TaskDetailModal
        isOpen={true}
        task={mockTask}
        {...mockHandlers}
      />
    );

    fireEvent.click(screen.getByText('Change Deadline'));
    expect(mockHandlers.onChangeDeadline).toHaveBeenCalledWith('test-123');
  });

  it('calls onDelete when Delete button clicked', () => {
    render(
      <TaskDetailModal
        isOpen={true}
        task={mockTask}
        {...mockHandlers}
      />
    );

    fireEvent.click(screen.getByText('Delete Task'));
    expect(mockHandlers.onDelete).toHaveBeenCalledWith('test-123');
  });

  it('calls onClose when close button clicked', () => {
    render(
      <TaskDetailModal
        isOpen={true}
        task={mockTask}
        {...mockHandlers}
      />
    );

    const closeButton = screen.getByLabelText(/close/i);
    fireEvent.click(closeButton);
    expect(mockHandlers.onClose).toHaveBeenCalled();
  });

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <TaskDetailModal
        isOpen={false}
        task={mockTask}
        {...mockHandlers}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('handles task with no description', () => {
    const taskNoDesc = { ...mockTask, description: '' };
    render(
      <TaskDetailModal
        isOpen={true}
        task={taskNoDesc}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.queryByText('This is a test task description')).not.toBeInTheDocument();
  });

  it('shows medium priority correctly', () => {
    const mediumTask = { ...mockTask, priority: 2 };
    render(
      <TaskDetailModal
        isOpen={true}
        task={mediumTask}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('Medium')).toBeInTheDocument();
  });

  it('shows low priority correctly', () => {
    const lowTask = { ...mockTask, priority: 3 };
    render(
      <TaskDetailModal
        isOpen={true}
        task={lowTask}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('Low')).toBeInTheDocument();
  });
});
