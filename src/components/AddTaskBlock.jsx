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
    backgroundColor: 'transparent',
    border: '2px dashed #007bff',
    borderRadius: '8px',
    padding: '30px',
    marginBottom: '15px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    transition: 'all 0.2s',
    // Remove default button styles
    outline: 'none',
    width: '100%'
  },
  icon: {
    fontSize: '48px',
    color: '#007bff',
    fontWeight: 'bold',
    lineHeight: 1
  },
  text: {
    fontSize: '18px',
    color: '#007bff',
    fontWeight: 'bold'
  }
};

export default AddTaskBlock;
