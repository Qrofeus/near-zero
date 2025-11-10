/**
 * Banner Component
 * Displays persistent notification banner at top of page
 */

/**
 * @param {object} props
 * @param {boolean} props.isVisible - Whether banner is visible
 * @param {string} props.message - Message to display
 * @param {string} props.variant - 'info' | 'warning' | 'danger' (default: 'info')
 * @param {boolean} props.dismissible - Whether banner can be dismissed (default: false)
 * @param {function} props.onDismiss - Callback when banner is dismissed
 */
function Banner({ isVisible, message, variant = 'info', dismissible = false, onDismiss }) {
  if (!isVisible) return null;

  const variantStyles = {
    info: {
      backgroundColor: 'var(--blue-1)',
      color: 'var(--blue-11)',
      borderColor: 'var(--blue-6)'
    },
    warning: {
      backgroundColor: 'var(--yellow-1)',
      color: 'var(--yellow-11)',
      borderColor: 'var(--yellow-6)'
    },
    danger: {
      backgroundColor: 'var(--red-1)',
      color: 'var(--red-11)',
      borderColor: 'var(--red-6)'
    }
  };

  const style = {
    ...styles.banner,
    ...variantStyles[variant]
  };

  return (
    <div style={style} role="alert">
      <span style={styles.message}>{message}</span>
      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          style={styles.closeButton}
          aria-label="Dismiss banner"
        >
          ✕
        </button>
      )}
    </div>
  );
}

const styles = {
  banner: {
    width: '100%',
    padding: '12px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    fontSize: '14px',
    borderTop: '1px solid',
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 998
  },
  message: {
    textAlign: 'center',
    flex: 1
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
    transition: 'opacity 0.2s',
    position: 'absolute',
    right: '20px'
  }
};

export default Banner;
