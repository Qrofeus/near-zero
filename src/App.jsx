/**
 * App Component
 * Main application component that manages task state and integrates all UI components
 */

import { useState, useEffect, useRef } from 'react';
import { GoPlus, GoGear, GoTasklist } from 'react-icons/go';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import SortToggle from './components/SortToggle';
import DensityControl from './components/DensityControl';
import TaskDetailModal from './components/TaskDetailModal';
import Modal from './components/Modal';
import AlertDialog from './components/AlertDialog';
import ConfirmDialog from './components/ConfirmDialog';
import Settings from './components/Settings';
import Toast from './components/Toast';
import Banner from './components/Banner';
import { localToUTC, isInPast } from './utils/datetime';
import { getAllTasks } from './utils/tasks';
import {
  createTask,
  updateTask,
  deleteTask as removeTask
} from './utils/taskStorage';
import { sortTasks } from './utils/sorting';
import { getSortMode, setSortMode } from './utils/preferences';
import { needsUrgentRefresh } from './utils/urgency';
import { getDensity, setDensity } from './utils/density';
import { useViewportWidth } from './hooks/useViewportWidth';
import { getAvailableDensities, shouldDemoteDensity, getDemotedDensity } from './utils/responsiveDensity';
import { isLocalStorageAvailable, getDemoMode, setDemoMode, generateExampleTasks } from './utils/demoMode';
import { needsVersionUpdate, performVersionUpdate } from './utils/version';
import { saveToStorage, STORAGE_KEYS } from './utils/storage';
import { useTheme } from './hooks/useTheme';

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
   * editingTask: Task object being edited (null when not editing)
   */
  const [editingTask, setEditingTask] = useState(null);

  /**
   * sortMode: Current sorting mode (deadline or priority)
   * Loaded from localStorage on mount
   */
  const [sortMode, setSortModeState] = useState(() => getSortMode());

  /**
   * density: Current density mode (compact/comfortable/spacious)
   * Loaded from localStorage on mount
   */
  const [density, setDensityState] = useState(() => getDensity());

  /**
   * Theme management (light/dark/system)
   */
  const { themePreference, setTheme } = useTheme();

  /**
   * Track viewport width for responsive density
   */
  const viewportWidth = useViewportWidth();

  /**
   * Calculate available densities based on viewport width
   */
  const availableDensities = getAvailableDensities(viewportWidth);

  /**
   * selectedTask: Task currently shown in detail modal
   */
  const [selectedTask, setSelectedTask] = useState(null);

  /**
   * Modal state management
   */
  const [alertDialog, setAlertDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    variant: 'primary'
  });

  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    variant: 'primary',
    onConfirm: () => {}
  });

  /**
   * Settings modal state
   */
  const [showSettings, setShowSettings] = useState(false);

  /**
   * Mobile menu state
   */
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /**
   * Navbar scroll state
   */
  const [isScrolled, setIsScrolled] = useState(false);

  /**
   * Toast notification state
   */
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    variant: 'info',
    duration: 3000
  });

  /**
   * Demo mode and storage availability state
   */
  const [demoMode, setDemoModeState] = useState(() => getDemoMode());
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [inMemoryTasks, setInMemoryTasks] = useState([]);

  /**
   * Ref to measure banner height for dynamic padding
   */
  const bannerRef = useRef(null);
  const [bannerHeight, setBannerHeight] = useState(0);

  /**
   * Helper functions for showing modals
   */
  const showAlert = (title, message, variant = 'primary') => {
    setAlertDialog({ isOpen: true, title, message, variant });
  };

  const showConfirm = (title, message, onConfirm, variant = 'primary') => {
    setConfirmDialog({ isOpen: true, title, message, onConfirm, variant });
  };

  const closeAlert = () => {
    setAlertDialog({ ...alertDialog, isOpen: false });
  };

  const closeConfirm = () => {
    setConfirmDialog({ ...confirmDialog, isOpen: false });
  };

  /**
   * Helper function for showing toast
   */
  const showToast = (message, variant = 'info', duration = 3000) => {
    setToast({ isVisible: true, message, variant, duration });
  };

  const closeToast = () => {
    setToast({ ...toast, isVisible: false });
  };

  /**
   * useEffect: Runs side effects in function components
   * The empty array [] means this runs only once when component mounts
   * Similar to componentDidMount in class components
   */
  useEffect(() => {
    // Check localStorage availability
    const hasStorage = isLocalStorageAvailable();
    setStorageAvailable(hasStorage);

    // Check version and perform update if needed
    if (needsVersionUpdate()) {
      showToast('Updating to the latest version...', 'info');
      performVersionUpdate();
      // Auto-reload after 1.5s
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      return;
    }

    // Check demo mode
    const isDemo = getDemoMode();
    setDemoModeState(isDemo);

    // Load tasks based on mode
    if (isDemo) {
      const exampleTasks = generateExampleTasks();
      setInMemoryTasks(exampleTasks);
      setTasks(exampleTasks);
      showToast('Enabled: Demo Mode', 'info');
    } else if (!hasStorage) {
      // localStorage unavailable - start with empty list
      setInMemoryTasks([]);
      setTasks([]);
    } else {
      // Normal mode - load from localStorage
      const loadedTasks = getAllTasks();
      setTasks(loadedTasks);
    }
  }, []); // Empty dependency array = run once on mount

  /**
   * useEffect: Auto-demote density when viewport becomes too narrow
   * Ensures selected density is always available for current viewport
   */
  useEffect(() => {
    if (shouldDemoteDensity(density, availableDensities)) {
      const demoted = getDemotedDensity(density, availableDensities);
      setDensity(demoted);
      setDensityState(demoted);
    }
  }, [availableDensities, density]); // Re-run when viewport or density changes

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
   * useEffect: Auto-refresh to update relative times and urgency colors
   * Normal: 5-minute interval
   * Urgent: 1-minute interval if any task ≤ 1 hour away or overdue
   */
  useEffect(() => {
    if (tasks.length === 0) return;

    // Determine refresh interval based on task urgency
    const isUrgent = needsUrgentRefresh(tasks);
    const interval = isUrgent ? 60 * 1000 : 5 * 60 * 1000; // 1min or 5min in ms

    // Force re-render by updating tasks from localStorage
    const timer = setInterval(() => {
      setTasks(getAllTasks());
    }, interval);

    // Cleanup: clear interval when component unmounts or dependencies change
    return () => {
      clearInterval(timer);
    };
  }, [tasks]); // Re-run when tasks change to adjust interval

  /**
   * useEffect: Prevent body scroll when mobile menu is open
   */
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  /**
   * useEffect: Measure banner height when banner visibility changes
   */
  useEffect(() => {
    const isBannerVisible = demoMode || !storageAvailable;
    if (bannerRef.current && isBannerVisible) {
      setBannerHeight(bannerRef.current.offsetHeight);
    } else {
      setBannerHeight(0);
    }
  }, [demoMode, storageAvailable]);

  /**
   * useEffect: Track scroll position for navbar shadow
   */
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /**
   * Handle form submission for new task
   * @param {object} formData - { title, description, dateString, timeString, priority }
   */
  const handleAddTask = (formData) => {
    // Convert local date/time to UTC
    const deadlineUTC = localToUTC(formData.dateString, formData.timeString);

    // Validate deadline is not in past
    if (isInPast(deadlineUTC)) {
      showAlert('Invalid Deadline', 'Deadline cannot be in the past', 'warning');
      return;
    }

    // In demo mode or storage unavailable: update in-memory only
    if (demoMode || !storageAvailable) {
      const result = createTask({
        title: formData.title,
        description: formData.description,
        deadline: deadlineUTC,
        priority: formData.priority
      });

      if (!result.success) {
        showAlert('Error', `Failed to create task: ${result.errors.join(', ')}`, 'danger');
        return;
      }

      const updatedTasks = [...inMemoryTasks, result.task];
      setInMemoryTasks(updatedTasks);
      setTasks(updatedTasks);
      setShowForm(false);
      showToast('Task Created', 'success');
      return;
    }

    // Normal mode: create and save to localStorage
    const result = createTask({
      title: formData.title,
      description: formData.description,
      deadline: deadlineUTC,
      priority: formData.priority
    });

    if (!result.success) {
      showAlert('Error', `Failed to create task: ${result.errors.join(', ')}`, 'danger');
      return;
    }

    // Update state with new task list
    // This triggers a re-render with the new task
    setTasks(getAllTasks());
    // Hide form after successful save
    setShowForm(false);
    showToast('Task Created', 'success');
  };

  /**
   * Handle form submission for editing task
   * @param {object} formData - { taskId, title, description, dateString, timeString, priority }
   */
  const handleUpdateTask = (formData) => {
    // Convert local date/time to UTC
    const deadlineUTC = localToUTC(formData.dateString, formData.timeString);

    // Validate deadline is not in past
    if (isInPast(deadlineUTC)) {
      showAlert('Invalid Deadline', 'Deadline cannot be in the past', 'warning');
      return;
    }

    // In demo mode or storage unavailable: update in-memory only
    if (demoMode || !storageAvailable) {
      const updatedTasks = inMemoryTasks.map(t =>
        t.id === formData.taskId
          ? {
              ...t,
              title: formData.title,
              description: formData.description,
              deadline: deadlineUTC,
              priority: formData.priority,
              lastModified: new Date().toISOString()
            }
          : t
      );
      setInMemoryTasks(updatedTasks);
      setTasks(updatedTasks);
      setEditingTask(null);
      showToast('Task Updated', 'success');
      return;
    }

    // Normal mode: update in localStorage
    const result = updateTask(formData.taskId, {
      title: formData.title,
      description: formData.description,
      deadline: deadlineUTC,
      priority: formData.priority
    });

    if (!result.success) {
      showAlert('Error', `Failed to update task: ${result.errors.join(', ')}`, 'danger');
      return;
    }

    // Update state with updated task list
    setTasks(getAllTasks());
    setEditingTask(null);
    showToast('Task Updated', 'success');
  };

  /**
   * Handle clicking on a task to view details
   */
  const handleTaskClick = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setSelectedTask(task);
    }
  };

  /**
   * Handle editing a task
   */
  const handleEditTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setSelectedTask(null); // Close detail modal
      setEditingTask(task); // Open edit modal
    }
  };


  /**
   * Handle deleting a task
   * Asks for confirmation before deleting
   */
  const handleDeleteTask = (taskId) => {
    // Find task to show in confirmation
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Close detail modal if open
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask(null);
    }

    // Show confirmation dialog
    showConfirm(
      'Delete Task',
      `Are you sure you want to delete "${task.title}"? This action cannot be undone.`,
      () => {
        // In demo mode or storage unavailable: update in-memory only
        if (demoMode || !storageAvailable) {
          const updatedTasks = inMemoryTasks.filter(t => t.id !== taskId);
          setInMemoryTasks(updatedTasks);
          setTasks(updatedTasks);
          showToast('Task Deleted', 'success');
          return;
        }

        // Normal mode: delete from localStorage
        const result = removeTask(taskId);
        if (result.success) {
          setTasks(getAllTasks());
          showToast('Task Deleted', 'success');
        } else {
          showAlert('Error', `Failed to delete: ${result.errors.join(', ')}`, 'danger');
        }
      },
      'danger'
    );
  };

  /**
   * Handle completing a task
   * Marks as complete and removes from list
   */
  const handleCompleteTask = (taskId) => {
    // Find task
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Show confirmation dialog
    showConfirm(
      'Complete Task',
      `Mark "${task.title}" as complete?`,
      () => {
        // In demo mode or storage unavailable: update in-memory only
        if (demoMode || !storageAvailable) {
          const updatedTasks = inMemoryTasks.filter(t => t.id !== taskId);
          setInMemoryTasks(updatedTasks);
          setTasks(updatedTasks);
          showToast('Task Completed', 'success');
          return;
        }

        // Normal mode: mark complete and remove from localStorage
        const result = removeTask(taskId);
        if (result.success) {
          setTasks(getAllTasks());
          showToast('Task Completed', 'success');
        } else {
          showAlert('Error', `Failed to complete: ${result.errors.join(', ')}`, 'danger');
        }
      },
      'primary'
    );
  };

  /**
   * Handle demo mode toggle
   */
  const handleDemoModeToggle = (enabled) => {
    setDemoMode(enabled);
    setDemoModeState(enabled);

    if (enabled) {
      // Entering demo mode - load example tasks
      const exampleTasks = generateExampleTasks();
      setInMemoryTasks(exampleTasks);
      setTasks(exampleTasks);
      showToast('Enabled: Demo Mode', 'success');
    } else {
      // Exiting demo mode - load from localStorage
      const loadedTasks = storageAvailable ? getAllTasks() : [];
      setInMemoryTasks([]);
      setTasks(loadedTasks);
      showToast('Disabled: Demo Mode', 'info');
    }

    setShowSettings(false);
  };

  /**
   * Handle import success
   */
  const handleImportSuccess = (importedTasks) => {
    if (demoMode || !storageAvailable) {
      // In demo mode or storage unavailable: update in-memory only
      setInMemoryTasks(importedTasks);
      setTasks(importedTasks);
      showToast(`Imported: ${importedTasks.length} tasks`, 'success');
    } else {
      // Normal mode: save to localStorage
      const saved = saveToStorage(STORAGE_KEYS.TASKS, importedTasks);
      if (saved) {
        setTasks(getAllTasks());
        showToast(`Imported: ${importedTasks.length} tasks`, 'success');
      } else {
        showAlert('Error', 'Failed to save imported tasks', 'danger');
      }
    }
    setShowSettings(false);
  };

  /**
   * Handle import error
   */
  const handleImportError = (error) => {
    showAlert('Import Failed', error, 'danger');
  };

  /**
   * Handle export success
   */
  const handleExportSuccess = () => {
    showToast('Exported: Tasks', 'success');
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
   * Handle density change
   * Saves to localStorage and updates state
   */
  const handleDensityChange = (newDensity) => {
    setDensity(newDensity);
    setDensityState(newDensity);
  };

  /**
   * Get sorted tasks based on current sort mode
   */
  const sortedTasks = sortTasks(tasks, sortMode);

  // Determine banner message and variant
  const getBannerInfo = () => {
    if (demoMode) {
      return {
        isVisible: true,
        message: 'Demo mode active - changes not saved. Exit demo mode for persistent tasks',
        variant: 'info'
      };
    }
    if (!storageAvailable) {
      return {
        isVisible: true,
        message: '⚠️ localStorage unavailable - changes not saved until session close',
        variant: 'warning'
      };
    }
    return { isVisible: false };
  };

  const bannerInfo = getBannerInfo();

  return (
    <div style={styles.app}>
      <header style={{
        ...styles.navbar,
        boxShadow: isScrolled ? 'var(--shadow-sm)' : 'none'
      }}>
        <div style={styles.logo} className="navbar-logo">
          <GoTasklist style={styles.logoIcon} />
          <div style={styles.logoText}>
            <h1 style={styles.title}>NearZero</h1>
            <p style={styles.subtitle} className="navbar-subtitle">Privacy-first task manager</p>
          </div>
        </div>

        {/* Desktop nav links */}
        <div style={styles.navLinks} className="nav-desktop">
          <button
            onClick={() => setShowForm(true)}
            style={styles.addButton}
            className="nav-button"
            aria-label="Add new task (press Q)"
          >
            <GoPlus /> Add Task (Q)
          </button>
          <button
            onClick={() => setShowSettings(true)}
            style={styles.settingsButton}
            className="nav-button"
            aria-label="Open settings"
          >
            <GoGear /> Settings
          </button>
        </div>

        {/* Mobile hamburger button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={styles.hamburgerButton}
          className="nav-mobile"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        {/* Mobile menu */}
        <div
          style={{
            ...styles.mobileMenu,
            transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(100%)'
          }}
          className="mobile-menu"
        >
          <button
            onClick={() => {
              setShowForm(true);
              setMobileMenuOpen(false);
            }}
            style={styles.mobileMenuItem}
            aria-label="Add new task (press Q)"
          >
            <GoPlus /> Add Task (Q)
          </button>
          <button
            onClick={() => {
              setShowSettings(true);
              setMobileMenuOpen(false);
            }}
            style={styles.mobileMenuItem}
            aria-label="Open settings"
          >
            <GoGear /> Settings
          </button>
        </div>

        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div
            style={styles.mobileMenuOverlay}
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </header>

      <main style={{ ...styles.main, paddingBottom: `${bannerHeight + 20}px` }}>
        {/* Controls: Sort and Density */}
        {tasks.length > 0 && (
          <div style={styles.controls}>
            <SortToggle
              currentMode={sortMode}
              onModeChange={handleSortModeChange}
            />
            <DensityControl
              currentDensity={density}
              onDensityChange={handleDensityChange}
              availableDensities={availableDensities}
            />
          </div>
        )}

        {/* Task list */}
        <TaskList
          tasks={sortedTasks}
          onClick={handleTaskClick}
          onDelete={handleDeleteTask}
          onComplete={handleCompleteTask}
          onAddTask={() => setShowForm(true)}
          density={density}
        />
      </main>

      {/* Alert Dialog */}
      <AlertDialog
        isOpen={alertDialog.isOpen}
        onClose={closeAlert}
        title={alertDialog.title}
        message={alertDialog.message}
        variant={alertDialog.variant}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={closeConfirm}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        variant={confirmDialog.variant}
        confirmText={confirmDialog.variant === 'danger' ? 'Delete' : 'Confirm'}
      />

      {/* Task Form Modal (Create) */}
      <Modal isOpen={showForm} onClose={() => setShowForm(false)} maxWidth="600px">
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
      </Modal>

      {/* Task Form Modal (Edit) */}
      <Modal isOpen={!!editingTask} onClose={() => setEditingTask(null)} maxWidth="600px">
        <div style={styles.formContainer}>
          <div style={styles.formHeader}>
            <h2 style={styles.formTitle}>Edit Task</h2>
            <button
              onClick={() => setEditingTask(null)}
              style={styles.closeButton}
              aria-label="Close form"
            >
              ✕
            </button>
          </div>
          <TaskForm onSubmit={handleUpdateTask} task={editingTask} />
        </div>
      </Modal>

      {/* Task Detail Modal */}
      <TaskDetailModal
        isOpen={!!selectedTask}
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
      />

      {/* Settings Modal */}
      <Settings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        demoMode={demoMode}
        onDemoModeToggle={handleDemoModeToggle}
        onImportSuccess={handleImportSuccess}
        onImportError={handleImportError}
        onExportSuccess={handleExportSuccess}
        themePreference={themePreference}
        onThemeChange={setTheme}
      />

      {/* Toast Notification */}
      <Toast
        isVisible={toast.isVisible}
        message={toast.message}
        variant={toast.variant}
        duration={toast.duration}
        onClose={closeToast}
      />

      {/* Banner for demo mode or storage unavailable */}
      <div ref={bannerRef}>
        <Banner
          isVisible={bannerInfo.isVisible}
          message={bannerInfo.message}
          variant={bannerInfo.variant}
        />
      </div>

      {/* Fade gradient overlay at bottom */}
      <div style={styles.fadeOverlay} />
    </div>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    backgroundColor: 'var(--bg-secondary)',
    display: 'flex',
    flexDirection: 'column'
  },
  navbar: {
    position: 'sticky',
    top: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5em 2em',
    backgroundColor: 'var(--bg-primary)',
    zIndex: 999,
    height: '70px',
    transition: 'box-shadow 0.2s ease'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  logoIcon: {
    fontSize: '2rem',
    color: 'var(--text-primary)'
  },
  logoText: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: 'var(--text-primary)',
      lineHeight: 1,
  },
  subtitle: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
      lineHeight: 0.75
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5em',
    flexWrap: 'wrap'
  },
  addButton: {
    padding: '0.5em 1em',
    fontSize: '1rem',
    fontWeight: 'bold',
    color: 'var(--text-primary)',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    outline: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  settingsButton: {
    padding: '0.5em 1em',
    fontSize: '1rem',
    fontWeight: 'bold',
    color: 'var(--text-primary)',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    outline: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  hamburgerButton: {
    display: 'none',
    padding: '0.5em',
    fontSize: '1.5rem',
    color: 'var(--text-primary)',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    outline: 'none'
  },
  mobileMenu: {
    position: 'fixed',
    top: '70px',
    right: 0,
    width: '75%',
    height: 'calc(100vh - 70px)',
    backgroundColor: 'var(--bg-primary)',
    boxShadow: '-2px 0 8px var(--shadow-lg)',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px',
    gap: '10px',
    transition: 'transform 0.3s ease-in-out',
    zIndex: 1000
  },
  mobileMenuItem: {
    padding: '1em',
    fontSize: '1rem',
    fontWeight: 'bold',
    color: 'var(--text-primary)',
    backgroundColor: 'transparent',
    border: '1px solid var(--border-primary)',
    borderRadius: '5px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'background-color 0.2s',
    outline: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  mobileMenuOverlay: {
    position: 'fixed',
    top: '70px',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999
  },
  main: {
    flex: 1,
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
    padding: '20px'
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
    marginBottom: '15px'
  },
  formContainer: {
    padding: '24px'
  },
  formHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  },
  formTitle: {
    fontSize: '20px',
    color: 'var(--text-primary)'
  },
  closeButton: {
    padding: '4px 8px',
    fontSize: '20px',
    color: 'var(--text-secondary)',
    backgroundColor: 'transparent',
    border: '2px solid transparent',
    cursor: 'pointer',
    borderRadius: '4px',
    lineHeight: 1,
    outline: 'none'
  },
  fadeOverlay: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: '200px',
    background: 'linear-gradient(to top, var(--bg-secondary) 0%, var(--bg-secondary) 20%, transparent 100%)',
    pointerEvents: 'none',
    zIndex: 997
  }
};

export default App;
