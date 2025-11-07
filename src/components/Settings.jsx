/**
 * Settings Component
 * Displays settings modal with import/export, demo mode, theme controls, and help
 */

import { useRef, useState } from 'react';
import Modal from './Modal';
import ThemeControl from './ThemeControl';
import HelpModal from './HelpModal';
import { downloadTasksAsJSON, importTasksFromJSON } from '../utils/importExport';

/**
 * @param {object} props
 * @param {boolean} props.isOpen - Whether settings modal is open
 * @param {function} props.onClose - Callback to close modal
 * @param {boolean} props.demoMode - Current demo mode state
 * @param {function} props.onDemoModeToggle - Callback when demo mode is toggled
 * @param {function} props.onImportSuccess - Callback when import succeeds (tasks)
 * @param {function} props.onImportError - Callback when import fails (error message)
 * @param {function} props.onExportSuccess - Callback when export succeeds
 * @param {'light' | 'dark' | 'system'} props.themePreference - Current theme preference
 * @param {function} props.onThemeChange - Callback when theme is changed
 */
function Settings({
  isOpen,
  onClose,
  demoMode,
  onDemoModeToggle,
  onImportSuccess,
  onImportError,
  onExportSuccess,
  themePreference,
  onThemeChange
}) {
  const fileInputRef = useRef(null);
  const [showHelp, setShowHelp] = useState(false);

  const handleExport = () => {
    try {
      downloadTasksAsJSON();
      onExportSuccess?.();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const jsonString = event.target?.result;
      if (typeof jsonString !== 'string') return;

      const result = importTasksFromJSON(jsonString);
      if (result.success) {
        onImportSuccess?.(result.tasks);
      } else {
        onImportError?.(result.error);
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    reader.onerror = () => {
      onImportError?.('Failed to read file');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    reader.readAsText(file);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="500px">
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>Settings</h2>
          <button
            onClick={onClose}
            style={styles.closeButton}
            aria-label="Close settings"
          >
            ✕
          </button>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Data Management</h3>

          <div style={styles.buttonGroup}>
            <button
              onClick={handleExport}
              style={styles.button}
              aria-label="Export tasks to JSON file"
            >
              Export Tasks
            </button>

            <button
              onClick={handleImportClick}
              style={styles.button}
              aria-label="Import tasks from JSON file"
            >
              Import Tasks
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileChange}
            style={styles.fileInput}
            aria-label="File input for importing tasks"
          />

          <p style={styles.hint}>
            Export saves all tasks to a JSON file. Import replaces current tasks with imported data.
          </p>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Appearance</h3>
          <ThemeControl currentTheme={themePreference} onThemeChange={onThemeChange} />
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Demo Mode</h3>

          <div style={styles.toggle}>
            <label style={styles.toggleLabel}>
              <input
                type="checkbox"
                checked={demoMode}
                onChange={(e) => onDemoModeToggle?.(e.target.checked)}
                style={styles.checkbox}
              />
              <span style={styles.toggleText}>
                {demoMode ? 'Enabled' : 'Disabled'}
              </span>
            </label>
          </div>

          <p style={styles.hint}>
            Demo mode loads example tasks and prevents saving to localStorage. All changes are in-memory only.
          </p>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Help & Documentation</h3>
          <button
            onClick={() => setShowHelp(true)}
            style={styles.helpButton}
            aria-label="Open help documentation"
          >
            📖 How to Use NearZero
          </button>
          <p style={styles.hint}>
            Learn about features, keyboard shortcuts, and privacy
          </p>
        </div>
      </div>

      {/* Help Modal */}
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </Modal>
  );
}

const styles = {
  container: {
    padding: '24px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
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
  section: {
    marginBottom: '24px',
    paddingBottom: '24px',
    borderBottom: '1px solid var(--border-primary)'
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: 'var(--text-secondary)',
    marginBottom: '12px'
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    marginBottom: '8px'
  },
  button: {
    flex: 1,
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--text-inverse)',
    backgroundColor: 'var(--accent)',
    border: '2px solid transparent',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    outline: 'none'
  },
  helpButton: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '15px',
    fontWeight: '500',
    color: 'var(--text-primary)',
    backgroundColor: 'var(--bg-secondary)',
    border: '2px solid var(--border-primary)',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    outline: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  fileInput: {
    display: 'none'
  },
  hint: {
    fontSize: '12px',
    color: 'var(--text-tertiary)',
    margin: '8px 0 0 0',
    lineHeight: '1.4'
  },
  toggle: {
    marginBottom: '8px'
  },
  toggleLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer'
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer'
  },
  toggleText: {
    fontSize: '14px',
    color: 'var(--text-primary)'
  }
};

export default Settings;
