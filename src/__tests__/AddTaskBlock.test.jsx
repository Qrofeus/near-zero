/**
 * Tests for AddTaskBlock component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddTaskBlock from '../components/AddTaskBlock';

describe('AddTaskBlock', () => {
  it('renders add task button', () => {
    render(<AddTaskBlock onAddTask={() => {}} />);

    expect(screen.getByText(/add new task/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add new task/i })).toBeInTheDocument();
  });

  it('calls onAddTask when clicked', async () => {
    const user = userEvent.setup();
    const onAddTask = vi.fn();

    render(<AddTaskBlock onAddTask={onAddTask} />);

    await user.click(screen.getByRole('button', { name: /add new task/i }));
    expect(onAddTask).toHaveBeenCalledTimes(1);
  });

  it('renders as a button element', () => {
    render(<AddTaskBlock onAddTask={() => {}} />);

    const button = screen.getByRole('button', { name: /add new task/i });
    expect(button.tagName).toBe('BUTTON');
  });
});
