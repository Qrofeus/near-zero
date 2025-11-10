/**
 * HelpModal Component
 * Displays comprehensive help and documentation for app features
 */

import Modal from './Modal';

/**
 * @param {object} props
 * @param {boolean} props.isOpen - Whether help modal is open
 * @param {function} props.onClose - Callback to close modal
 */
function HelpModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="700px">
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>How to Use NearZero</h2>
          <button
            onClick={onClose}
            style={styles.closeButton}
            aria-label="Close help"
          >
            ✕
          </button>
        </div>

        <div style={styles.content}>
          {/* Overview */}
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Overview</h3>
            <p style={styles.text}>
              <strong>NearZero</strong> is a privacy-first task manager focused on deadline tracking. All data stays on your device - no accounts, no servers, no cloud sync.
            </p>
          </section>

          {/* Creating & Managing Tasks */}
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Creating & Managing Tasks</h3>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                <strong>Add Task:</strong> Click "+ Add Task (Q)" button or press <kbd style={styles.kbd}>Q</kbd> key
              </li>
              <li style={styles.listItem}>
                <strong>View Details:</strong> Click any task card to open full details
              </li>
              <li style={styles.listItem}>
                <strong>Edit Task:</strong> Click task card, then "Edit Task" button
              </li>
              <li style={styles.listItem}>
                <strong>Complete Task:</strong> Click "Complete" button on task card (removes task)
              </li>
              <li style={styles.listItem}>
                <strong>Delete Task:</strong> Click trash icon next to priority badge
              </li>
            </ul>
          </section>

          {/* Priorities & Deadlines */}
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Priorities & Deadlines</h3>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                <strong>Priority Levels:</strong> High (red), Medium (yellow), Low (green)
              </li>
              <li style={styles.listItem}>
                <strong>Urgency Colors:</strong> Task border changes from green → yellow → orange → red as deadline approaches
              </li>
              <li style={styles.listItem}>
                <strong>Overdue Tasks:</strong> Grouped separately at top with red border and blink animation
              </li>
              <li style={styles.listItem}>
                <strong>Urgent Tasks:</strong> Pulse animation when {"<"}1 hour remaining
              </li>
            </ul>
          </section>

          {/* Sorting & Organization */}
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Sorting & Organization</h3>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                <strong>Default Sort:</strong> By deadline (earliest first)
              </li>
              <li style={styles.listItem}>
                <strong>Priority Sort:</strong> Groups by priority (High → Medium → Low), then by deadline within each group
              </li>
              <li style={styles.listItem}>
                <strong>Auto-Refresh:</strong> Updates every 5 minutes (1 minute when any task {"<"}1 hour)
              </li>
            </ul>
          </section>

          {/* Layout & Density */}
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Layout & Density</h3>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                <strong>Spacious:</strong> Single column, max focus
              </li>
              <li style={styles.listItem}>
                <strong>Comfortable:</strong> 2 columns (default)
              </li>
              <li style={styles.listItem}>
                <strong>Compact:</strong> 3 columns, max tasks visible
              </li>
              <li style={styles.listItem}>
                Your preference is saved automatically
              </li>
            </ul>
          </section>

          {/* Theme */}
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Theme</h3>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                <strong>Light:</strong> Bright background, dark text
              </li>
              <li style={styles.listItem}>
                <strong>Dark:</strong> Dark background, light text
              </li>
              <li style={styles.listItem}>
                <strong>System:</strong> Follows your OS theme preference
              </li>
            </ul>
          </section>

          {/* Import & Export */}
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Import & Export</h3>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                <strong>Export:</strong> Download all tasks as JSON file (backup)
              </li>
              <li style={styles.listItem}>
                <strong>Import:</strong> Upload JSON file to restore tasks (replaces current tasks)
              </li>
              <li style={styles.listItem}>
                Descriptions auto-truncate to 300 characters on import
              </li>
            </ul>
          </section>

          {/* Demo Mode */}
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Demo Mode</h3>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                <strong>Purpose:</strong> Try app with example tasks
              </li>
              <li style={styles.listItem}>
                <strong>Usage:</strong> Toggle in Settings
              </li>
              <li style={styles.listItem}>
                <strong>Note:</strong> Changes not saved in demo mode (in-memory only)
              </li>
            </ul>
          </section>

          {/* Keyboard Shortcuts */}
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Keyboard Shortcuts</h3>
            <div style={styles.keymap}>
              <div style={styles.keymapRow}>
                <kbd style={styles.kbd}>Q</kbd>
                <span style={styles.keymapDesc}>Quick add new task</span>
              </div>
            </div>
          </section>

          {/* Privacy & Storage */}
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>Privacy & Storage</h3>
            <ul style={styles.list}>
              <li style={styles.listItem}>
                <strong>100% Client-Side:</strong> No backend, no servers, no accounts
              </li>
              <li style={styles.listItem}>
                <strong>localStorage:</strong> Data saved in browser (stays on your device)
              </li>
              <li style={styles.listItem}>
                <strong>No Tracking:</strong> Zero analytics, zero data collection
              </li>
              <li style={styles.listItem}>
                <strong>Backup Recommended:</strong> Export tasks periodically (browser data can be cleared)
              </li>
            </ul>
          </section>
        </div>
      </div>
    </Modal>
  );
}

const styles = {
  container: {
    padding: '0',
    maxHeight: '80vh',
    overflow: 'auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0',
    position: 'sticky',
    top: 0,
    backgroundColor: 'var(--bg-primary)',
    zIndex: 10,
    padding: '24px 24px 12px 24px',
    borderBottom: '2px solid var(--border-primary)'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'var(--text-primary)',
    margin: 0
  },
  closeButton: {
    padding: '4px 8px',
    fontSize: '24px',
    color: 'var(--text-secondary)',
    backgroundColor: 'transparent',
    border: '2px solid transparent',
    cursor: 'pointer',
    borderRadius: '4px',
    lineHeight: 1,
    outline: 'none'
  },
  content: {
    lineHeight: '1.6',
    padding: '24px',
  },
  section: {
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: 'var(--text-primary)',
    marginBottom: '12px',
    marginTop: 0
  },
  text: {
    fontSize: '15px',
    color: 'var(--text-primary)',
    margin: 0,
    lineHeight: '1.6',
      minWidth: '100%',
  },
  list: {
    margin: 0,
    paddingLeft: '20px',
    fontSize: '15px',
    color: 'var(--text-primary)'
  },
  listItem: {
    marginBottom: '8px',
    lineHeight: '1.6',
      minWidth: '100%',
  },
  kbd: {
    padding: '2px 6px',
    fontSize: '13px',
    fontFamily: 'monospace',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-primary)',
    borderRadius: '3px',
    boxShadow: '0 1px 0 var(--shadow-sm)',
    color: 'var(--text-primary)',
    fontWeight: 'bold'
  },
  keymap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  keymapRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  keymapDesc: {
    fontSize: '15px',
    color: 'var(--text-primary)'
  }
};

export default HelpModal;
