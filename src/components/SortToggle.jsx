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
          aria-pressed={currentMode === SORT_MODES.DEADLINE}
        >
          Deadline
        </button>
        <button
          onClick={() => onModeChange(SORT_MODES.PRIORITY)}
          style={{
            ...styles.button,
            ...(currentMode === SORT_MODES.PRIORITY ? styles.buttonActive : {})
          }}
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
    gap: '10px',
    marginBottom: '20px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
  },
  toggleGroup: {
    display: 'flex',
    gap: '0',
    border: '2px solid #007bff',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  button: {
    padding: '6px 16px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#007bff',
    backgroundColor: 'white',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
    borderRight: '1px solid #007bff',
  },
  buttonActive: {
    backgroundColor: '#007bff',
    color: 'white',
    fontWeight: '600',
  },
};

export default SortToggle;
