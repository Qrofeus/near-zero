import { GoSun, GoMoon, GoDeviceDesktop } from 'react-icons/go';
import { THEME_MODES } from '../utils/theme';
import './ThemeControl.css';

/**
 * Theme control component for switching between light/dark/system themes
 * @param {{
 *   currentTheme: 'light' | 'dark' | 'system',
 *   onThemeChange: (theme: 'light' | 'dark' | 'system') => void
 * }} props
 */
export default function ThemeControl({ currentTheme, onThemeChange }) {
  const themes = [
    { value: THEME_MODES.LIGHT, label: 'Light', icon: <GoSun /> },
    { value: THEME_MODES.DARK, label: 'Dark', icon: <GoMoon /> },
    { value: THEME_MODES.SYSTEM, label: 'System', icon: <GoDeviceDesktop /> },
  ];

  const handleThemeClick = (themeValue) => {
    // Don't trigger onChange if clicking the already active theme
    if (themeValue === currentTheme) return;
    onThemeChange(themeValue);
  };

  return (
    <div className="theme-control">
      <label className="theme-control-label">Theme</label>
      <div className="theme-control-buttons">
        {themes.map(({ value, label, icon }) => (
          <button
            key={value}
            type="button"
            className={`theme-button ${currentTheme === value ? 'active' : ''}`}
            onClick={() => handleThemeClick(value)}
            aria-label={`Switch to ${label.toLowerCase()} theme`}
            aria-pressed={currentTheme === value}
          >
            <span className="theme-icon">{icon}</span>
            <span className="theme-label">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
