/**
 * AlertDialog Component
 * Simple alert/message dialog with single OK button
 * Keyboard accessible: Enter closes dialog
 */

import { useEffect, useRef } from 'react';
import Modal from './Modal';

/**
 * AlertDialog - Simple alert modal
 * @param {boolean} isOpen - Whether dialog is visible
 * @param {function} onClose - Callback when dialog closes
 * @param {string} title - Dialog title
 * @param {string} message - Dialog message
 * @param {string} [buttonText] - Button text (default: 'OK')
 * @param {string} [variant] - Button variant: 'danger', 'warning', 'primary' (default: 'primary')
 * @returns {JSX.Element}
 */
function AlertDialog({
  isOpen,
  onClose,
  title,
  message,
  buttonText = 'OK',
  variant = 'primary'
}) {
  const buttonRef = useRef(null);

  const getButtonStyle = () => {
    switch (variant) {
      case 'danger':
        return styles.dangerButton;
      case 'warning':
        return styles.warningButton;
      default:
        return styles.primaryButton;
    }
  };

  // Handle Enter key to close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Auto-focus OK button when modal opens
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      buttonRef.current.focus();
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="450px">
      <div style={styles.container}>
        <h2 style={styles.title}>{title}</h2>
        <p style={styles.message}>{message}</p>
        <div style={styles.actions}>
          <button
            ref={buttonRef}
            onClick={onClose}
            style={{ ...styles.button, ...getButtonStyle() }}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </Modal>
  );
}

const styles = {
  container: {
    padding: '24px'
  },
  title: {
    marginBottom: '16px',
    fontSize: '20px',
    fontWeight: 'bold',
    color: 'var(--text-primary)'
  },
  message: {
    marginBottom: '24px',
    fontSize: '15px',
    color: 'var(--text-secondary)',
    lineHeight: '1.5'
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  button: {
    padding: '10px 24px',
    fontSize: '15px',
    fontWeight: '600',
    border: '2px solid transparent',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    minWidth: '80px',
    outline: 'none'
  },
  primaryButton: {
    backgroundColor: 'var(--accent)',
    color: '#fff'
  },
  warningButton: {
    backgroundColor: 'var(--warning)',
    color: 'var(--text-primary)'
  },
  dangerButton: {
    backgroundColor: 'var(--error)',
    color: '#fff'
  }
};

export default AlertDialog;
