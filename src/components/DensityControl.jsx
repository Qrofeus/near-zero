/**
 * DensityControl Component
 * Allows user to toggle between different task list density modes
 * Dynamically shows only available density options based on viewport width
 */

import { DENSITY_MODES } from '../utils/density';

/**
 * DensityControl - Toggle for task list density
 * @param {string} currentDensity - Current density mode
 * @param {function} onDensityChange - Callback when density changes (receives new density)
 * @param {Array<string>} availableDensities - Available density modes for current viewport
 * @returns {JSX.Element}
 */
function DensityControl({ currentDensity, onDensityChange, availableDensities = Object.values(DENSITY_MODES) }) {
  // Density button configurations
  const densityButtons = [
    {
      mode: DENSITY_MODES.COMPACT,
      icon: '⊞⊞⊞',
      label: 'Compact view'
    },
    {
      mode: DENSITY_MODES.COMFORTABLE,
      icon: '⊞⊞',
      label: 'Comfortable view'
    },
    {
      mode: DENSITY_MODES.SPACIOUS,
      icon: '⊞',
      label: 'Spacious view'
    }
  ];

  return (
    <div style={styles.container}>
      <span style={styles.label}>View:</span>
      <div style={styles.buttonGroup}>
        {densityButtons
          .filter(btn => availableDensities.includes(btn.mode))
          .map((btn, index, array) => (
            <button
              key={btn.mode}
              onClick={() => onDensityChange(btn.mode)}
              style={{
                ...styles.button,
                ...(currentDensity === btn.mode ? styles.activeButton : {}),
                ...(index === array.length - 1 ? { borderRight: 'none' } : {})
              }}
              aria-label={btn.label}
            >
              {btn.icon}
            </button>
          ))
        }
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--text-primary)'
  },
  buttonGroup: {
    display: 'flex',
    gap: '0',
    border: '2px solid var(--accent)',
    borderRadius: '6px',
    overflow: 'hidden'
  },
  button: {
    padding: '6px 16px',
    fontSize: '14px',
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--accent)',
    border: 'none',
    borderRight: '1px solid var(--accent)',
    cursor: 'pointer',
    fontWeight: '500',
    outline: 'none',
    transition: 'all 0.2s'
  },
  activeButton: {
    backgroundColor: 'var(--accent)',
    color: '#fff',
    fontWeight: '600'
  }
};

export default DensityControl;
