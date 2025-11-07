import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThemeControl from '../components/ThemeControl';

describe('ThemeControl component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should render all theme options', () => {
    const mockSetTheme = vi.fn();
    render(<ThemeControl currentTheme="system" onThemeChange={mockSetTheme} />);

    expect(screen.getByText('Light')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
    expect(screen.getByText('System')).toBeInTheDocument();
  });

  it('should highlight the current theme', () => {
    const mockSetTheme = vi.fn();
    const { rerender } = render(<ThemeControl currentTheme="light" onThemeChange={mockSetTheme} />);

    const lightButton = screen.getByText('Light').closest('button');
    expect(lightButton).toHaveClass('active');

    rerender(<ThemeControl currentTheme="dark" onThemeChange={mockSetTheme} />);
    const darkButton = screen.getByText('Dark').closest('button');
    expect(darkButton).toHaveClass('active');

    rerender(<ThemeControl currentTheme="system" onThemeChange={mockSetTheme} />);
    const systemButton = screen.getByText('System').closest('button');
    expect(systemButton).toHaveClass('active');
  });

  it('should call onThemeChange when theme is selected', async () => {
    const user = userEvent.setup();
    const mockSetTheme = vi.fn();
    const { rerender } = render(<ThemeControl currentTheme="system" onThemeChange={mockSetTheme} />);

    await user.click(screen.getByText('Light'));
    expect(mockSetTheme).toHaveBeenCalledWith('light');

    rerender(<ThemeControl currentTheme="light" onThemeChange={mockSetTheme} />);
    await user.click(screen.getByText('Dark'));
    expect(mockSetTheme).toHaveBeenCalledWith('dark');

    rerender(<ThemeControl currentTheme="dark" onThemeChange={mockSetTheme} />);
    await user.click(screen.getByText('System'));
    expect(mockSetTheme).toHaveBeenCalledWith('system');
  });

  it('should not call onThemeChange when clicking the already active theme', async () => {
    const user = userEvent.setup();
    const mockSetTheme = vi.fn();
    render(<ThemeControl currentTheme="light" onThemeChange={mockSetTheme} />);

    await user.click(screen.getByText('Light'));
    expect(mockSetTheme).not.toHaveBeenCalled();
  });

  it('should have accessible labels', () => {
    const mockSetTheme = vi.fn();
    render(<ThemeControl currentTheme="system" onThemeChange={mockSetTheme} />);

    const lightButton = screen.getByText('Light').closest('button');
    const darkButton = screen.getByText('Dark').closest('button');
    const systemButton = screen.getByText('System').closest('button');

    expect(lightButton).toHaveAttribute('aria-label');
    expect(darkButton).toHaveAttribute('aria-label');
    expect(systemButton).toHaveAttribute('aria-label');
  });

  it('should indicate active state with aria-pressed', () => {
    const mockSetTheme = vi.fn();
    render(<ThemeControl currentTheme="dark" onThemeChange={mockSetTheme} />);

    const lightButton = screen.getByText('Light').closest('button');
    const darkButton = screen.getByText('Dark').closest('button');
    const systemButton = screen.getByText('System').closest('button');

    expect(lightButton).toHaveAttribute('aria-pressed', 'false');
    expect(darkButton).toHaveAttribute('aria-pressed', 'true');
    expect(systemButton).toHaveAttribute('aria-pressed', 'false');
  });
});
