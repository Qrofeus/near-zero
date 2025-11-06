/**
 * TaskList Component
 * Renders a list of tasks using TaskItem components
 * Groups overdue tasks separately at the top
 * Always shows AddTaskBlock at the end for easy task creation
 * Supports multi-column responsive layout based on density
 */

import TaskItem from './TaskItem';
import AddTaskBlock from './AddTaskBlock';
import { isOverdue } from '../utils/urgency';
import { DENSITY_MODES } from '../utils/density';
import { COLORS } from '../constants/colors';

/**
 * TaskList - Displays tasks and add task block
 * @param {Array} tasks - Array of task objects
 * @param {function} onClick - Callback when task clicked
 * @param {function} onEdit - Callback for editing a task
 * @param {function} onDelete - Callback for deleting a task
 * @param {function} onComplete - Callback for completing a task
 * @param {function} onAddTask - Callback for opening task creation form
 * @param {string} density - Density mode for layout
 * @returns {JSX.Element}
 */
function TaskList({ tasks, onClick, onEdit, onDelete, onComplete, onAddTask, density = DENSITY_MODES.COMFORTABLE }) {
  // Separate tasks into overdue and upcoming
  const overdueTasks = tasks.filter(task => isOverdue(task.deadline));
  const upcomingTasks = tasks.filter(task => !isOverdue(task.deadline));

  // Get grid columns based on density
  // Fixed column counts with min/max widths - user controls 1, 2, or 3 columns
  const getGridColumns = () => {
    switch (density) {
      case DENSITY_MODES.COMPACT:
        // 3 columns, min 250px, max 300px each
        return 'repeat(3, minmax(250px, 300px))';
      case DENSITY_MODES.COMFORTABLE:
        // 2 columns, min 250px, max 350px each
        return 'repeat(2, minmax(250px, 350px))';
      case DENSITY_MODES.SPACIOUS:
        // Single column, max 600px
        return 'minmax(250px, 600px)';
      default:
        return 'repeat(2, minmax(250px, 350px))';
    }
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: getGridColumns(),
    justifyContent: 'center', // Center columns if they don't fill container width
    gap: '20px',
    marginBottom: '20px',
    gridAutoRows: 'min-content',
    // Center single column layout
    ...(density === DENSITY_MODES.SPACIOUS && {
      marginLeft: 'auto',
      marginRight: 'auto'
    })
  };

  return (
    <div style={styles.list}>
      {/* Overdue tasks section */}
      {overdueTasks.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionHeader}>Overdue</h2>
          <div style={gridStyle}>
            {overdueTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onClick={onClick}
                onEdit={onEdit}
                onDelete={onDelete}
                onComplete={onComplete}
              />
            ))}
            {/* Show AddTaskBlock here if no upcoming tasks */}
            {upcomingTasks.length === 0 && (
              <AddTaskBlock onAddTask={onAddTask} />
            )}
          </div>
        </div>
      )}

      {/* Upcoming tasks section */}
      {upcomingTasks.length > 0 && (
        <div style={styles.section}>
          {overdueTasks.length > 0 && (
            <h2 style={styles.sectionHeader}>Upcoming</h2>
          )}
          <div style={gridStyle}>
            {upcomingTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onClick={onClick}
                onEdit={onEdit}
                onDelete={onDelete}
                onComplete={onComplete}
              />
            ))}
            {/* Always show AddTaskBlock at end of upcoming tasks */}
            <AddTaskBlock onAddTask={onAddTask} />
          </div>
        </div>
      )}

      {/* Show AddTaskBlock alone if no tasks exist */}
      {tasks.length === 0 && (
        <div style={gridStyle}>
          <AddTaskBlock onAddTask={onAddTask} />
        </div>
      )}
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
    color: COLORS.textDark,
    marginBottom: '15px',
    marginTop: '10px',
    paddingBottom: '8px',
    borderBottom: `2px solid ${COLORS.borderLight}`
  }
};

export default TaskList;
