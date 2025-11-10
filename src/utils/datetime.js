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
 * Format deadline as absolute local time
 * @param {string} utcString - UTC ISO 8601 string
 * @param {string} format - Format string (default: 'MMM D, YYYY h:mm A')
 * @returns {string} Formatted local time string
 */
export function formatAbsoluteTime(utcString, format = 'MMM D, YYYY h:mm A') {
  return dayjs(utcString).local().format(format);
}
