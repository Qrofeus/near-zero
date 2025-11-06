/**
 * AddTaskBlock Component
 * Transparent block with dashed border that opens task creation form when clicked
 * Displayed at the end of task list
 */

import { COLORS } from '../constants/colors';

/**
 * AddTaskBlock - Clickable block to open task form
 * @param {function} onAddTask - Callback to open task creation form
 * @returns {JSX.Element}
 */
function AddTaskBlock({ onAddTask }) {
  return (
    <button
      onClick={onAddTask}
      style={styles.block}
      aria-label="Add new task (press Q)"
    >
      <span style={styles.icon}>+</span>
      <span style={styles.text}>Add New Task (Q)</span>
    </button>
  );
}

const styles = {
  block: {
    // Make it look like a task card but with dashed border
    backgroundColor: COLORS.bgTransparent,
    border: `2px dashed ${COLORS.primary}`,
    borderRadius: '8px',
    padding: '15px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s',
    // Remove default button styles
    outline: 'none',
    width: '100%', // Fill grid track
    transform: 'scale(1)',
  },
  icon: {
    fontSize: '36px',
    color: COLORS.primary,
    fontWeight: 'bold',
    lineHeight: 1
  },
  text: {
    fontSize: '16px',
    color: COLORS.primary,
    fontWeight: 'bold'
  }
};

export default AddTaskBlock;
