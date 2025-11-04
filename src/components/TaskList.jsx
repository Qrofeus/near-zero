/**
 * TaskList Component
 * Renders a list of tasks using TaskItem components
 * Always shows AddTaskBlock at the end for easy task creation
 */

import TaskItem from './TaskItem';
import AddTaskBlock from './AddTaskBlock';

/**
 * TaskList - Displays tasks and add task block
 * @param {Array} tasks - Array of task objects
 * @param {function} onEdit - Callback for editing a task
 * @param {function} onDelete - Callback for deleting a task
 * @param {function} onComplete - Callback for completing a task
 * @param {function} onAddTask - Callback for opening task creation form
 * @returns {JSX.Element}
 */
function TaskList({ tasks, onEdit, onDelete, onComplete, onAddTask }) {
  return (
    <div style={styles.list}>
      {/* Render each task using TaskItem component */}
      {/* The "key" prop is required by React for list items */}
      {/* It helps React identify which items have changed for efficient updates */}
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onComplete={onComplete}
        />
      ))}

      {/* Always show AddTaskBlock at end, even when list is empty */}
      <AddTaskBlock onAddTask={onAddTask} />
    </div>
  );
}

const styles = {
  list: {
    display: 'flex',
    flexDirection: 'column'
  }
};

export default TaskList;
