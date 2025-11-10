import { GoPlus } from 'react-icons/go';

/**
 * AddTaskBlock Component
 * Transparent block with dashed border that opens task creation form when clicked
 * Displayed at the end of task list
 */

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
      className="add-task-block"
      aria-label="Add new task (press Q)"
    >
      <GoPlus style={styles.icon} />
    </button>
  );
}

const styles = {
  block: {
    backgroundColor: 'transparent',
    border: '2px dashed var(--accent)',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    transition: 'all 0.2s',
    outline: 'none',
    padding: '15px',
    minHeight: '120px',
    width: '100%',
    alignSelf: 'start'
  },
  icon: {
    fontSize: '32px',
    color: 'var(--accent)',
  },
};

export default AddTaskBlock;
