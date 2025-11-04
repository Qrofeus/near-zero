/**
 * Date/time conversion utilities
 * Handles conversion between local time and UTC using dayjs
 */

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';

// Enable plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

/**
 * Convert local date and time inputs to UTC ISO 8601 string
 * @param {string} dateString - Date string from <input type="date"> (YYYY-MM-DD)
 * @param {string} timeString - Time string from <input type="time"> (HH:mm)
 * @returns {string} UTC ISO 8601 string
 */
export function localToUTC(dateString, timeString) {
  const localDateTime = `${dateString}T${timeString}`;
  return dayjs(localDateTime).utc().toISOString();
}

/**
 * Convert UTC ISO 8601 string to local date string for <input type="date">
 * @param {string} utcString - UTC ISO 8601 string
 * @returns {string} Local date string (YYYY-MM-DD)
 */
export function utcToLocalDate(utcString) {
  return dayjs(utcString).local().format('YYYY-MM-DD');
}

/**
 * Convert UTC ISO 8601 string to local time string for <input type="time">
 * @param {string} utcString - UTC ISO 8601 string
 * @returns {string} Local time string (HH:mm)
 */
export function utcToLocalTime(utcString) {
  return dayjs(utcString).local().format('HH:mm');
}

/**
 * Get current UTC time as ISO 8601 string
 * @returns {string} Current UTC ISO 8601 string
 */
export function getCurrentUTC() {
  return dayjs().utc().toISOString();
}

/**
 * Check if a deadline is in the past
 * @param {string} utcString - UTC ISO 8601 string
 * @returns {boolean} True if deadline is in the past
 */
export function isInPast(utcString) {
  return dayjs(utcString).isBefore(dayjs());
}

/**
 * Get time remaining until deadline
 * @param {string} utcString - UTC ISO 8601 string
 * @returns {number} Milliseconds until deadline (negative if overdue)
 */
export function getTimeRemaining(utcString) {
  return dayjs(utcString).diff(dayjs());
}

/**
 * Format deadline as relative time (e.g., "in 3 hours", "2 days ago")
 * @param {string} utcString - UTC ISO 8601 string
 * @returns {string} Relative time string
 */
export function formatRelativeTime(utcString) {
  return dayjs(utcString).fromNow();
}

/**
 * Format deadline as absolute local time
 * @param {string} utcString - UTC ISO 8601 string
 * @param {string} format - Format string (default: 'MMM D, YYYY h:mm A')
 * @returns {string} Formatted local time string
 */
export function formatAbsoluteTime(utcString, format = 'MMM D, YYYY h:mm A') {
  return dayjs(utcString).local().format(format);
}

/**
 * Get time remaining in human-readable format (e.g., "3h 20m")
 * @param {string} utcString - UTC ISO 8601 string
 * @returns {string} Time remaining string
 */
export function getTimeRemainingFormatted(utcString) {
  const ms = getTimeRemaining(utcString);

  if (ms < 0) {
    return 'Overdue';
  }

  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}
