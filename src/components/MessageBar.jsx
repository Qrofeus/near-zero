/**
 * MessageBar Component
 * Fixed position message bar for notices/info/warnings/errors
 * Single line with drag-to-scroll, no visible scrollbar
 *
 * COLOR SCHEME REFERENCE (for future implementation):
 * ====================================================
 *
 * DEFAULT (General notices):
 *   - Background: rgba(51, 51, 51, 0.5) - Dark gray with 50% opacity
 *   - Text: white
 *   - Border/Outline: Optional matching color
 *
 * INFO (Informational messages):
 *   - Background: Light blue (e.g., rgba(59, 130, 246, 0.5) or rgba(96, 165, 250, 0.5))
 *   - Text: Dark/bright blue (e.g., #1e40af or #2563eb)
 *   - Border/Outline: Dark/bright blue to match text
 *
 * WARNING (Warnings/cautions):
 *   - Background: Yellow/orange (e.g., rgba(251, 191, 36, 0.5) or rgba(251, 146, 60, 0.5))
 *   - Text: Dark orange/brown (e.g., #92400e or #b45309)
 *   - Border/Outline: Dark orange/brown to match text
 *
 * ERROR (Errors/critical):
 *   - Background: Red (e.g., rgba(239, 68, 68, 0.5) or rgba(248, 113, 113, 0.5))
 *   - Text: Dark red (e.g., #991b1b or #b91c1c)
 *   - Border/Outline: Dark red to match text
 *
 * OPACITY STANDARD:
 *   - All backgrounds use 0.5 (50%) opacity for consistency
 *
 * FUTURE IMPLEMENTATION:
 *   Add a 'type' prop: type="default"|"info"|"warning"|"error"
 *   Apply corresponding backgroundColor, color, and optional border based on type
 */

import { useRef, useState } from 'react';

/**
 * MessageBar - Display info/notice messages
 * @param {string} message - Message to display
 * @param {boolean} show - Whether to show the message bar
 * @returns {JSX.Element|null}
 */
function MessageBar({ message, show }) {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  if (!show || !message) return null;

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
    scrollRef.current.style.cursor = 'grabbing';
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (scrollRef.current) {
      scrollRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div style={styles.container}>
      <div
        ref={scrollRef}
        style={styles.message}
        className="message-bar-content"
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {message}
      </div>
    </div>
  );
}

/**
 * Styles for MessageBar
 *
 * To implement message types (info/warning/error):
 *   1. Accept a 'type' prop in MessageBar function
 *   2. Create conditional styles based on type
 *   3. Apply colors from COLOR SCHEME REFERENCE above
 *   4. Example: const bgColor = type === 'info' ? 'rgba(59, 130, 246, 0.5)' : 'rgba(51, 51, 51, 0.5)'
 *   5. Pass dynamic styles to container div
 */
const styles = {
  container: {
    position: 'fixed',
    bottom: '12px',
    left: '12px',
    right: '12px',
    backgroundColor: 'rgba(51, 51, 51, 0.5)', // DEFAULT - See COLOR SCHEME REFERENCE above
    color: 'white',
    padding: '12px 20px',
    zIndex: 999,
    boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '6px'
    // Optional: Add border: '2px solid [color]' for colored outline when implementing types
  },
  message: {
    fontSize: '14px',
    lineHeight: '1.2',
    whiteSpace: 'nowrap',
    overflow: 'auto',
    cursor: 'grab',
    userSelect: 'none',
    // Hide scrollbar
    scrollbarWidth: 'none', // Firefox
    msOverflowStyle: 'none', // IE/Edge
    // Webkit browsers
    WebkitOverflowScrolling: 'touch'
  }
};

export default MessageBar;
