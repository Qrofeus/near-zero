/**
 * DensityControl Component
 * Allows user to toggle between different task list density modes
 * Dynamically shows only available density options based on viewport width
 */

import { DENSITY_MODES } from '../utils/density';
import { COLORS } from '../constants/colors';

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
          .map(btn => (
            <button
              key={btn.mode}
              onClick={() => onDensityChange(btn.mode)}
              style={{
                ...styles.button,
                ...(currentDensity === btn.mode ? styles.activeButton : {})
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
    gap: '10px',
    marginBottom: '15px',
    padding: '10px',
    backgroundColor: COLORS.bgWhite,
    borderRadius: '6px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  label: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: COLORS.textMedium
  },
  buttonGroup: {
    display: 'flex',
    gap: '5px'
  },
  button: {
    padding: '6px 12px',
    fontSize: '16px',
    backgroundColor: COLORS.bgLightGray,
    color: COLORS.textMedium,
    border: '2px solid transparent',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    outline: 'none',
    transition: 'all 0.2s'
  },
  activeButton: {
    backgroundColor: COLORS.primary,
    color: COLORS.bgWhite
  }
};

export default DensityControl;
