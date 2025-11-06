/**
 * Settings Component
 * Displays settings modal with import/export and demo mode controls
 */

import { useRef } from 'react';
import Modal from './Modal';
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
 */
function Settings({
  isOpen,
  onClose,
  demoMode,
  onDemoModeToggle,
  onImportSuccess,
  onImportError,
  onExportSuccess
}) {
  const fileInputRef = useRef(null);

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
      </div>
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
    color: '#333',
    margin: 0
  },
  closeButton: {
    padding: '4px 8px',
    fontSize: '24px',
    color: '#666',
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
    borderBottom: '1px solid #e0e0e0'
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#555',
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
    color: 'white',
    backgroundColor: '#007bff',
    border: '2px solid transparent',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    outline: 'none'
  },
  fileInput: {
    display: 'none'
  },
  hint: {
    fontSize: '12px',
    color: '#666',
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
    color: '#333'
  }
};

export default Settings;
