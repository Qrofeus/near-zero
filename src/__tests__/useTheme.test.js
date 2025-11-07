import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme } from '../hooks/useTheme';

describe('useTheme hook', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('should initialize with system theme by default', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.themePreference).toBe('system');
    expect(['light', 'dark']).toContain(result.current.resolvedTheme);
  });

  it('should initialize with stored preference', () => {
    localStorage.setItem('NINAD_PREFS_V1', JSON.stringify({ theme: 'dark' }));
    const { result } = renderHook(() => useTheme());
    expect(result.current.themePreference).toBe('dark');
    expect(result.current.resolvedTheme).toBe('dark');
  });

  it('should apply theme to document on mount', () => {
    localStorage.setItem('NINAD_PREFS_V1', JSON.stringify({ theme: 'light' }));
    renderHook(() => useTheme());
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('should change theme and persist preference', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('dark');
    });

    expect(result.current.themePreference).toBe('dark');
    expect(result.current.resolvedTheme).toBe('dark');

    const prefs = JSON.parse(localStorage.getItem('NINAD_PREFS_V1'));
    expect(prefs.theme).toBe('dark');
  });

  it('should update document when theme changes', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('dark');
    });

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    act(() => {
      result.current.setTheme('light');
    });

    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('should resolve system theme correctly', () => {
    const matchMediaMock = vi.fn().mockReturnValue({
      matches: true,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
    vi.stubGlobal('matchMedia', matchMediaMock);

    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('system');
    });

    expect(result.current.themePreference).toBe('system');
    expect(result.current.resolvedTheme).toBe('dark');

    vi.unstubAllGlobals();
  });

  it('should listen to system theme changes when preference is system', () => {
    const listeners = [];
    const matchMediaMock = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn((event, listener) => {
        listeners.push(listener);
      }),
      removeEventListener: vi.fn(),
    });
    vi.stubGlobal('matchMedia', matchMediaMock);

    const { result, unmount } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('system');
    });

    expect(result.current.resolvedTheme).toBe('light');

    // Simulate system theme change
    act(() => {
      listeners.forEach(listener => listener({ matches: true }));
    });

    expect(result.current.resolvedTheme).toBe('dark');

    unmount();
    vi.unstubAllGlobals();
  });

  it('should not listen to system theme changes when preference is not system', () => {
    // Start with a non-system preference to avoid initial listener setup
    localStorage.setItem('NINAD_PREFS_V1', JSON.stringify({ theme: 'light' }));

    const addEventListenerSpy = vi.fn();
    const matchMediaMock = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: addEventListenerSpy,
      removeEventListener: vi.fn(),
    });
    vi.stubGlobal('matchMedia', matchMediaMock);

    const { result } = renderHook(() => useTheme());

    expect(result.current.themePreference).toBe('light');
    expect(addEventListenerSpy).not.toHaveBeenCalled();

    vi.unstubAllGlobals();
  });

  it('should cleanup system theme listener on unmount', () => {
    const removeEventListenerSpy = vi.fn();
    const matchMediaMock = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: removeEventListenerSpy,
    });
    vi.stubGlobal('matchMedia', matchMediaMock);

    const { result, unmount } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('system');
    });

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalled();

    vi.unstubAllGlobals();
  });
});
