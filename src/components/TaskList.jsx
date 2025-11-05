/**
 * TaskList Component
 * Renders a list of tasks using TaskItem components
 * Groups overdue tasks separately at the top
 * Always shows AddTaskBlock at the end for easy task creation
 */

import TaskItem from './TaskItem';
import AddTaskBlock from './AddTaskBlock';
import { isOverdue } from '../utils/urgency';

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
  // Separate tasks into overdue and upcoming
  const overdueTasks = tasks.filter(task => isOverdue(task.deadline));
  const upcomingTasks = tasks.filter(task => !isOverdue(task.deadline));

  return (
    <div style={styles.list}>
      {/* Overdue tasks section */}
      {overdueTasks.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionHeader}>Overdue</h2>
          {overdueTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onComplete={onComplete}
            />
          ))}
        </div>
      )}

      {/* Upcoming tasks section */}
      {upcomingTasks.length > 0 && (
        <div style={styles.section}>
          {overdueTasks.length > 0 && (
            <h2 style={styles.sectionHeader}>Upcoming</h2>
          )}
          {upcomingTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onComplete={onComplete}
            />
          ))}
        </div>
      )}

      {/* Always show AddTaskBlock at end, even when list is empty */}
      <AddTaskBlock onAddTask={onAddTask} />
    </div>
  );
}

const styles = {
  list: {
    display: 'flex',
    flexDirection: 'column'
  },
  section: {
    marginBottom: '20px'
  },
  sectionHeader: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '15px',
    marginTop: '10px',
    paddingBottom: '8px',
    borderBottom: '2px solid #ddd'
  }
};

export default TaskList;
