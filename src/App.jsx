/**
 * App Component
 * Main application component that manages task state and integrates all UI components
 */

import { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import SortToggle from './components/SortToggle';
import { localToUTC, isInPast } from './utils/datetime';
import { getAllTasks } from './utils/tasks';
import {
  createTask,
  deleteTask as removeTask
} from './utils/taskStorage';
import { sortTasks } from './utils/sorting';
import { getSortMode, setSortMode } from './utils/preferences';

function App() {
  /**
   * useState: Creates state that persists between renders
   * When state changes, React re-renders the component
   *
   * tasks: Array of task objects
   * setTasks: Function to update tasks (triggers re-render)
   */
  const [tasks, setTasks] = useState([]);

  /**
   * showForm: Boolean to control whether task form is visible
   * Initially hidden (false), shown when user clicks "Add Task" button
   */
  const [showForm, setShowForm] = useState(false);

  /**
   * sortMode: Current sorting mode (deadline or priority)
   * Loaded from localStorage on mount
   */
  const [sortMode, setSortModeState] = useState(() => getSortMode());

  /**
   * useEffect: Runs side effects in function components
   * The empty array [] means this runs only once when component mounts
   * Similar to componentDidMount in class components
   */
  useEffect(() => {
    // Load tasks from localStorage when app starts
    const loadedTasks = getAllTasks();
    setTasks(loadedTasks);
  }, []); // Empty dependency array = run once on mount

  /**
   * useEffect: Add keyboard shortcuts
   * 'Q' key opens the form and focuses on title input
   * 'Esc' key closes the form
   */
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Handle 'Q' key to open form
      if (
        (e.key === 'q' || e.key === 'Q') &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey &&
        e.target.tagName !== 'INPUT' &&
        e.target.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault(); // Prevent 'q' from being typed
        setShowForm(true);
      }

      // Handle 'Esc' key to close form
      if (e.key === 'Escape' && showForm) {
        setShowForm(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    // Cleanup: remove event listener when component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [showForm]); // Include showForm in dependencies for Esc handler

  /**
   * Handle form submission for new task
   * @param {object} formData - { title, description, dateString, timeString, priority }
   */
  const handleAddTask = (formData) => {
    // Convert local date/time to UTC
    const deadlineUTC = localToUTC(formData.dateString, formData.timeString);

    // Validate deadline is not in past
    if (isInPast(deadlineUTC)) {
      alert('Deadline cannot be in the past');
      return;
    }

    // Create and save task to localStorage
    const result = createTask({
      title: formData.title,
      description: formData.description,
      deadline: deadlineUTC,
      priority: formData.priority
    });

    if (!result.success) {
      alert(`Error: ${result.errors.join(', ')}`);
      return;
    }

    // Update state with new task list
    // This triggers a re-render with the new task
    setTasks(getAllTasks());
    // Hide form after successful save
    setShowForm(false);
  };

  /**
   * Handle editing a task
   * For Phase 2, just show which task would be edited
   * Full edit functionality will come in later phases
   */
  const handleEditTask = (taskId) => {
    alert(`Edit functionality for task ${taskId} will be implemented in later phases`);
  };

  /**
   * Handle deleting a task
   * Asks for confirmation before deleting
   */
  const handleDeleteTask = (taskId) => {
    // Find task to show in confirmation
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Confirm deletion
    if (!window.confirm(`Delete task "${task.title}"?`)) {
      return;
    }

    // Delete from localStorage and update state
    const result = removeTask(taskId);
    if (result.success) {
      setTasks(getAllTasks());
    } else {
      alert(`Failed to delete: ${result.errors.join(', ')}`);
    }
  };

  /**
   * Handle completing a task
   * Marks as complete and removes from list
   */
  const handleCompleteTask = (taskId) => {
    // Find task
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Confirm completion
    if (!window.confirm(`Mark "${task.title}" as complete?`)) {
      return;
    }

    // Mark complete (sets isCompleted=true then removes)
    const result = removeTask(taskId);
    if (result.success) {
      setTasks(getAllTasks());
    } else {
      alert(`Failed to complete: ${result.errors.join(', ')}`);
    }
  };

  /**
   * Handle sort mode change
   * Saves to localStorage and updates state
   */
  const handleSortModeChange = (newMode) => {
    setSortMode(newMode);
    setSortModeState(newMode);
  };

  /**
   * Get sorted tasks based on current sort mode
   */
  const sortedTasks = sortTasks(tasks, sortMode);

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>DueList</h1>
          <button
            onClick={() => setShowForm(true)}
            style={styles.addButton}
            aria-label="Add new task (press Q)"
          >
            + Add Task (Q)
          </button>
        </div>
        <p style={styles.subtitle}>Privacy-first task manager with deadline tracking</p>
      </header>

      <main style={styles.main}>
        {/* Task creation form - shown/hidden based on showForm state */}
        {showForm && (
          <div style={styles.formContainer}>
            <div style={styles.formHeader}>
              <h2 style={styles.formTitle}>Create New Task</h2>
              <button
                onClick={() => setShowForm(false)}
                style={styles.closeButton}
                aria-label="Close form"
              >
                ✕
              </button>
            </div>
            <TaskForm onSubmit={handleAddTask} />
          </div>
        )}

        {/* Sort mode toggle */}
        {tasks.length > 0 && (
          <SortToggle
            currentMode={sortMode}
            onModeChange={handleSortModeChange}
          />
        )}

        {/* Task list */}
        <TaskList
          tasks={sortedTasks}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onComplete={handleCompleteTask}
          onAddTask={() => setShowForm(true)}
        />
      </main>

      <footer style={styles.footer}>
        <p style={styles.footerText}>
          All data stored locally in your browser. {tasks.length} task{tasks.length !== 1 ? 's' : ''} total.
        </p>
      </footer>
    </div>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '20px',
    textAlign: 'center'
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
    flexWrap: 'wrap'
  },
  title: {
    margin: 0,
    fontSize: '32px',
    fontWeight: 'bold'
  },
  addButton: {
    padding: '8px 16px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#007bff',
    backgroundColor: 'white',
    border: '2px solid white',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  subtitle: {
    margin: '5px 0 0 0',
    fontSize: '14px',
    opacity: 0.9
  },
  main: {
    flex: 1,
    maxWidth: '800px',
    width: '100%',
    margin: '0 auto',
    padding: '20px'
  },
  formContainer: {
    backgroundColor: 'white',
    border: '2px solid #007bff',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
  },
  formHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  },
  formTitle: {
    margin: 0,
    fontSize: '20px',
    color: '#333'
  },
  closeButton: {
    padding: '4px 8px',
    fontSize: '20px',
    color: '#666',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '4px',
    lineHeight: 1
  },
  footer: {
    backgroundColor: '#333',
    color: 'white',
    padding: '15px',
    textAlign: 'center'
  },
  footerText: {
    margin: 0,
    fontSize: '14px'
  }
};

export default App;
