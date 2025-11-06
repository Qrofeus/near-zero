/**
 * ConfirmDialog Component
 * Reusable confirmation dialog with customizable title, message, and buttons
 * Keyboard accessible: Enter confirms, Escape cancels
 */

import { useEffect, useRef } from 'react';
import Modal from './Modal';
import { COLORS } from '../constants/colors';

/**
 * ConfirmDialog - Confirmation modal dialog
 * @param {boolean} isOpen - Whether dialog is visible
 * @param {function} onClose - Callback when dialog closes without confirming
 * @param {function} onConfirm - Callback when user confirms
 * @param {string} title - Dialog title
 * @param {string} message - Dialog message/question
 * @param {string} [confirmText] - Confirm button text (default: 'Confirm')
 * @param {string} [cancelText] - Cancel button text (default: 'Cancel')
 * @param {string} [variant] - Button variant: 'danger' or 'primary' (default: 'primary')
 * @returns {JSX.Element}
 */
function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary'
}) {
  const confirmButtonRef = useRef(null);

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  // Handle Enter key to confirm
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onConfirm();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onConfirm, onClose]);

  // Auto-focus confirm button when modal opens
  useEffect(() => {
    if (isOpen && confirmButtonRef.current) {
      confirmButtonRef.current.focus();
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="450px">
      <div style={styles.container}>
        <h2 style={styles.title}>{title}</h2>
        <p style={styles.message}>{message}</p>
        <div style={styles.actions}>
          <button
            onClick={onClose}
            style={{ ...styles.button, ...styles.cancelButton }}
          >
            {cancelText}
          </button>
          <button
            ref={confirmButtonRef}
            onClick={handleConfirm}
            style={{
              ...styles.button,
              ...(variant === 'danger' ? styles.dangerButton : styles.confirmButton)
            }}
          >
            {confirmText}
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
    color: COLORS.textDark
  },
  message: {
    marginBottom: '24px',
    fontSize: '15px',
    color: COLORS.textMedium,
    lineHeight: '1.5'
  },
  actions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end'
  },
  button: {
    padding: '10px 20px',
    fontSize: '15px',
    fontWeight: '600',
    border: '2px solid transparent',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    outline: 'none'
  },
  cancelButton: {
    backgroundColor: COLORS.bgGray,
    color: COLORS.textGray
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    color: COLORS.bgWhite
  },
  dangerButton: {
    backgroundColor: COLORS.danger,
    color: COLORS.bgWhite
  }
};

export default ConfirmDialog;
