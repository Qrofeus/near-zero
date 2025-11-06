/**
 * TaskForm Component
 * Form for creating new tasks with native date/time inputs
 */

import { useState, useRef, useEffect } from 'react';
import { COLORS } from '../constants/colors';

/**
 * Get default deadline (next day 6 PM local time)
 * @returns {object} { dateString, timeString }
 */
function getDefaultDeadline() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(18, 0, 0, 0); // 6 PM

  // Format for input[type="date"]: YYYY-MM-DD in local timezone
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const day = String(tomorrow.getDate()).padStart(2, '0');
  const dateString = `${year}-${month}-${day}`;

  // Format for input[type="time"]: HH:MM
  const timeString = '18:00';

  return { dateString, timeString };
}

/**
 * TaskForm - A controlled form component for creating tasks
 * @param {function} onSubmit - Callback when form is submitted with task data
 * @returns {JSX.Element}
 */
function TaskForm({ onSubmit }) {
  const defaults = getDefaultDeadline();

  // useState hook: Creates state variables that persist across re-renders
  // Each call returns [currentValue, setterFunction]
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateString, setDateString] = useState(defaults.dateString);
  const [timeString, setTimeString] = useState(defaults.timeString);
  const [priority, setPriority] = useState(2); // Default: Medium

  // useRef: Create a reference to the title input for auto-focus
  const titleInputRef = useRef(null);

  /**
   * useEffect: Auto-focus title input when form is shown
   */
  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, []); // Empty array = run once on mount

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = (e) => {
    // Prevent default form submission (which would reload the page)
    e.preventDefault();

    // Only submit if required fields are filled
    if (!title.trim() || !dateString || !timeString) {
      return;
    }

    // Call parent's onSubmit with form data
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      dateString,
      timeString,
      priority: Number(priority) // Ensure priority is a number
    });

    // Clear form after submission and reset to next day 6 PM
    const newDefaults = getDefaultDeadline();
    setTitle('');
    setDescription('');
    setDateString(newDefaults.dateString);
    setTimeString(newDefaults.timeString);
    setPriority(2);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form} autoComplete="off">
      {/* Title input */}
      <div style={styles.field}>
        <label htmlFor="task-title" style={styles.label}>
          Task Title *
        </label>
        <input
          ref={titleInputRef}
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="What needs to be done?"
          style={styles.input}
          autoComplete="off"
        />
      </div>

      {/* Description textarea */}
      <div style={styles.field}>
        <label htmlFor="task-description" style={styles.label}>
          Description
        </label>
        <textarea
          id="task-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add details (max 300 characters)"
          maxLength={300}
          rows={3}
          style={styles.textarea}
          autoComplete="off"
        />
      </div>

      {/* Deadline inputs: Date and Time side by side */}
      <div style={styles.dateTimeRow}>
        <div style={styles.field}>
          <label htmlFor="task-date" style={styles.label}>
            Deadline Date *
          </label>
          <input
            id="task-date"
            type="date"
            value={dateString}
            onChange={(e) => setDateString(e.target.value)}
            required
            style={styles.input}
            autoComplete="off"
          />
        </div>

        <div style={styles.field}>
          <label htmlFor="task-time" style={styles.label}>
            Deadline Time *
          </label>
          <input
            id="task-time"
            type="time"
            value={timeString}
            onChange={(e) => setTimeString(e.target.value)}
            required
            style={styles.input}
            autoComplete="off"
          />
        </div>
      </div>

      {/* Priority select */}
      <div style={styles.field}>
        <label htmlFor="task-priority" style={styles.label}>
          Priority
        </label>
        <select
          id="task-priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={styles.select}
          autoComplete="off"
        >
          <option value={1}>High</option>
          <option value={2}>Medium</option>
          <option value={3}>Low</option>
        </select>
      </div>

      {/* Submit button */}
      <button type="submit" style={styles.button}>
        Add Task
      </button>
    </form>
  );
}

// Basic inline styles for the form
const styles = {
  form: {
    backgroundColor: COLORS.bgOffWhite,
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: `1px solid ${COLORS.borderLight}`
  },
  field: {
    marginBottom: '15px',
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    marginBottom: '5px',
    fontWeight: 'bold',
    fontSize: '14px',
    color: COLORS.textDark
  },
  input: {
    padding: '8px 12px',
    fontSize: '14px',
    border: `1px solid ${COLORS.borderMedium}`,
    borderRadius: '4px',
    outline: 'none'
  },
  textarea: {
    padding: '8px 12px',
    fontSize: '14px',
    border: `1px solid ${COLORS.borderMedium}`,
    borderRadius: '4px',
    outline: 'none',
    fontFamily: 'inherit',
    resize: 'vertical'
  },
  select: {
    padding: '8px 12px',
    fontSize: '14px',
    border: `1px solid ${COLORS.borderMedium}`,
    borderRadius: '4px',
    outline: 'none',
    backgroundColor: COLORS.bgWhite
  },
  dateTimeRow: {
    display: 'flex',
    gap: '15px'
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: COLORS.bgWhite,
    backgroundColor: COLORS.primary,
    border: '2px solid transparent',
    borderRadius: '4px',
    cursor: 'pointer',
    width: '100%',
    outline: 'none'
  }
};

export default TaskForm;
