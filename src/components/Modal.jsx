/**
 * Modal Component
 * Generic modal/popup overlay component
 * Handles backdrop clicks, ESC key, and minimal scrollbar styling
 */

import { useEffect } from 'react';
import { COLORS } from '../constants/colors';

/**
 * Modal - Generic modal overlay
 * @param {boolean} isOpen - Whether modal is visible
 * @param {function} onClose - Callback when modal should close
 * @param {ReactNode} children - Content to display in modal
 * @param {string} [maxWidth] - Optional max width (default: '500px')
 * @returns {JSX.Element|null}
 */
function Modal({ isOpen, onClose, children, maxWidth = '500px' }) {
  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div
        style={{ ...styles.modal, maxWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
  },
  modal: {
    backgroundColor: COLORS.bgWhite,
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
    maxHeight: '90vh',
    overflow: 'auto',
    width: '100%',
    // Minimal scrollbar styling (webkit browsers)
    WebkitOverflowScrolling: 'touch',
    scrollbarWidth: 'thin', // Firefox
    scrollbarColor: `${COLORS.scrollbarThumb} ${COLORS.scrollbarTrack}` // Firefox: thumb track
  }
};

export default Modal;
