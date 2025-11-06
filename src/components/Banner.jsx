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
      backgroundColor: '#cce5ff',
      color: '#004085',
      borderColor: '#b8daff'
    },
    warning: {
      backgroundColor: '#fff3cd',
      color: '#856404',
      borderColor: '#ffeaa7'
    },
    danger: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
      borderColor: '#f5c6cb'
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
    borderBottom: '1px solid',
    position: 'relative'
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
