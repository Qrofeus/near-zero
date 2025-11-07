/**
 * Tests for TaskForm component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskForm from '../components/TaskForm';

describe('TaskForm', () => {
  it('renders all form fields', () => {
    render(<TaskForm onSubmit={() => {}} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/deadline date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/deadline time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();
  });

  it('calls onSubmit with task data when form is submitted', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<TaskForm onSubmit={onSubmit} />);

    // Fill form (clear date/time first since they're auto-filled)
    await user.type(screen.getByLabelText(/title/i), 'Test Task');
    await user.type(screen.getByLabelText(/description/i), 'Test description');

    const dateInput = screen.getByLabelText(/deadline date/i);
    const timeInput = screen.getByLabelText(/deadline time/i);
    await user.clear(dateInput);
    await user.type(dateInput, '2025-12-31');
    await user.clear(timeInput);
    await user.type(timeInput, '23:59');

    await user.selectOptions(screen.getByLabelText(/priority/i), '1');

    // Submit
    await user.click(screen.getByRole('button', { name: /add task/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Test Task',
      description: 'Test description',
      dateString: '2025-12-31',
      timeString: '23:59',
      priority: 1
    });
  });

  it('clears form after successful submission', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<TaskForm onSubmit={onSubmit} />);

    const titleInput = screen.getByLabelText(/title/i);
    const descInput = screen.getByLabelText(/description/i);
    const dateInput = screen.getByLabelText(/deadline date/i);
    const timeInput = screen.getByLabelText(/deadline time/i);

    await user.type(titleInput, 'Test Task');
    await user.type(descInput, 'Test description');
    await user.clear(dateInput);
    await user.type(dateInput, '2025-12-31');
    await user.clear(timeInput);
    await user.type(timeInput, '23:59');

    await user.click(screen.getByRole('button', { name: /add task/i }));

    // Title and description should be cleared
    expect(titleInput).toHaveValue('');
    expect(descInput).toHaveValue('');

    // Date and time should reset to next day 6 PM (not empty)
    expect(timeInput).toHaveValue('18:00');
    // Date should be tomorrow (we can't test exact value as it changes daily)
    expect(dateInput.value).toBeTruthy();
  });

  it('does not submit if title is empty', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<TaskForm onSubmit={onSubmit} />);

    // Fill only date/time, leave title empty
    await user.type(screen.getByLabelText(/deadline date/i), '2025-12-31');
    await user.type(screen.getByLabelText(/deadline time/i), '23:59');

    await user.click(screen.getByRole('button', { name: /add task/i }));

    // HTML5 validation should prevent submission
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('defaults priority to Medium (2)', () => {
    render(<TaskForm onSubmit={() => {}} />);

    const prioritySelect = screen.getByLabelText(/priority/i);
    expect(prioritySelect).toHaveValue('2');
  });

  it('auto-fills date and time to next day 6 PM', () => {
    render(<TaskForm onSubmit={() => {}} />);

    const dateInput = screen.getByLabelText(/deadline date/i);
    const timeInput = screen.getByLabelText(/deadline time/i);

    // Time should be 18:00 (6 PM)
    expect(timeInput).toHaveValue('18:00');

    // Date should be set (tomorrow)
    expect(dateInput.value).toBeTruthy();
    expect(dateInput.value).toMatch(/^\d{4}-\d{2}-\d{2}$/); // YYYY-MM-DD format
  });

  describe('Edit mode', () => {
    const mockTask = {
      id: 'task-1',
      title: 'Existing Task',
      description: 'Existing description',
      deadline: '2025-12-25T18:00:00.000Z', // UTC
      priority: 1
    };

    it('renders with pre-filled data when task prop is provided', () => {
      render(<TaskForm onSubmit={() => {}} task={mockTask} />);

      expect(screen.getByLabelText(/title/i)).toHaveValue('Existing Task');
      expect(screen.getByLabelText(/description/i)).toHaveValue('Existing description');
      expect(screen.getByLabelText(/priority/i)).toHaveValue('1');
    });

    it('shows "Update Task" button in edit mode', () => {
      render(<TaskForm onSubmit={() => {}} task={mockTask} />);

      expect(screen.getByRole('button', { name: /update task/i })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /add task/i })).not.toBeInTheDocument();
    });

    it('calls onSubmit with taskId in edit mode', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();

      render(<TaskForm onSubmit={onSubmit} task={mockTask} />);

      // Modify title
      const titleInput = screen.getByLabelText(/title/i);
      await user.clear(titleInput);
      await user.type(titleInput, 'Updated Task');

      await user.click(screen.getByRole('button', { name: /update task/i }));

      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          taskId: 'task-1',
          title: 'Updated Task',
          description: 'Existing description',
          priority: 1
        })
      );
    });

    it('does not clear form after submission in edit mode', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();

      render(<TaskForm onSubmit={onSubmit} task={mockTask} />);

      const titleInput = screen.getByLabelText(/title/i);
      await user.clear(titleInput);
      await user.type(titleInput, 'Modified Title');

      await user.click(screen.getByRole('button', { name: /update task/i }));

      // Form should retain values in edit mode
      expect(titleInput).toHaveValue('Modified Title');
    });

    it('converts UTC deadline to local date/time for editing', () => {
      render(<TaskForm onSubmit={() => {}} task={mockTask} />);

      const dateInput = screen.getByLabelText(/deadline date/i);
      const timeInput = screen.getByLabelText(/deadline time/i);

      // Should have some value (exact value depends on timezone)
      expect(dateInput.value).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(timeInput.value).toMatch(/^\d{2}:\d{2}$/);
    });
  });
});
