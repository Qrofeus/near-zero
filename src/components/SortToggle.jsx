/**
 * SortToggle Component
 * Allows user to switch between deadline and priority sorting modes
 */

import { SORT_MODES } from '../utils/sorting';

function SortToggle({ currentMode, onModeChange }) {
  return (
    <div style={styles.container}>
      <label style={styles.label}>Sort by:</label>
      <div style={styles.toggleGroup}>
        <button
          onClick={() => onModeChange(SORT_MODES.DEADLINE)}
          style={{
            ...styles.button,
            ...(currentMode === SORT_MODES.DEADLINE ? styles.buttonActive : {})
          }}
          className="toggle-button"
          aria-pressed={currentMode === SORT_MODES.DEADLINE}
        >
          Deadline
        </button>
        <button
          onClick={() => onModeChange(SORT_MODES.PRIORITY)}
          style={{
            ...styles.button,
            ...(currentMode === SORT_MODES.PRIORITY ? styles.buttonActive : {}),
            borderRight: 'none'
          }}
          className="toggle-button"
          aria-pressed={currentMode === SORT_MODES.PRIORITY}
        >
          Priority
        </button>
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
    color: 'var(--text-primary)',
  },
  toggleGroup: {
    display: 'flex',
    gap: '0',
    border: '2px solid var(--accent)',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  button: {
    padding: '6px 16px',
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--accent)',
    backgroundColor: 'var(--bg-primary)',
    border: 'none',
    borderRadius: '0',
    cursor: 'pointer',
    transition: 'background-color 0.2s, color 0.2s',
    borderRight: '1px solid var(--accent)',
    outline: 'none'
  },
  buttonActive: {
    backgroundColor: 'var(--accent)',
    color: '#fff',
    fontWeight: '600',
  },
};

export default SortToggle;
