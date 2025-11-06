/**
 * Toast Component
 * Displays temporary notification messages
 */

import { useEffect } from 'react';

/**
 * @param {object} props
 * @param {boolean} props.isVisible - Whether toast is visible
 * @param {string} props.message - Message to display
 * @param {function} props.onClose - Callback when toast closes
 * @param {number} props.duration - Duration in ms (default: 3000)
 * @param {string} props.variant - 'info' | 'success' | 'warning' | 'danger' (default: 'info')
 */
function Toast({ isVisible, message, onClose, duration = 3000, variant = 'info' }) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const variantStyles = {
    info: {
      backgroundColor: '#007bff',
      color: 'white'
    },
    success: {
      backgroundColor: '#28a745',
      color: 'white'
    },
    warning: {
      backgroundColor: '#ffc107',
      color: '#333'
    },
    danger: {
      backgroundColor: '#dc3545',
      color: 'white'
    }
  };

  const style = {
    ...styles.toast,
    ...variantStyles[variant]
  };

  return (
    <div style={style} role="alert">
      <span style={styles.message}>{message}</span>
      <button
        onClick={onClose}
        style={styles.closeButton}
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  );
}

const styles = {
  toast: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    minWidth: '250px',
    maxWidth: '400px',
    padding: '12px 16px',
    borderRadius: '6px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    zIndex: 10000,
    animation: 'slideIn 0.3s ease-out'
  },
  message: {
    flex: 1,
    fontSize: '14px'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: 'inherit',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '0',
    lineHeight: 1,
    opacity: 0.8,
    transition: 'opacity 0.2s'
  }
};

export default Toast;
