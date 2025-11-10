import { describe, it, expect } from 'vitest';
import dayjs from 'dayjs';
import {
  localToUTC,
  utcToLocalDate,
  utcToLocalTime,
  getCurrentUTC,
  isInPast,
  formatAbsoluteTime,
} from '../utils/datetime';

describe('DateTime Utilities', () => {
  describe('localToUTC', () => {
    it('should convert local date and time to UTC ISO string', () => {
      const dateString = '2025-12-25';
      const timeString = '14:30';

      const result = localToUTC(dateString, timeString);

      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      expect(dayjs(result).isValid()).toBe(true);
    });

    it('should handle midnight correctly', () => {
      const dateString = '2025-12-25';
      const timeString = '00:00';

      const result = localToUTC(dateString, timeString);

      expect(dayjs(result).isValid()).toBe(true);
    });

    it('should handle end of day correctly', () => {
      const dateString = '2025-12-25';
      const timeString = '23:59';

      const result = localToUTC(dateString, timeString);

      expect(dayjs(result).isValid()).toBe(true);
    });
  });

  describe('utcToLocalDate', () => {
    it('should convert UTC string to local date format', () => {
      const utcString = '2025-12-25T18:00:00.000Z';

      const result = utcToLocalDate(utcString);

      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should handle different UTC times', () => {
      const utcString = '2025-01-01T00:00:00.000Z';

      const result = utcToLocalDate(utcString);

      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('utcToLocalTime', () => {
    it('should convert UTC string to local time format', () => {
      const utcString = '2025-12-25T18:00:00.000Z';

      const result = utcToLocalTime(utcString);

      expect(result).toMatch(/^\d{2}:\d{2}$/);
    });

    it('should handle midnight UTC', () => {
      const utcString = '2025-12-25T00:00:00.000Z';

      const result = utcToLocalTime(utcString);

      expect(result).toMatch(/^\d{2}:\d{2}$/);
    });
  });

  describe('getCurrentUTC', () => {
    it('should return current UTC time as ISO string', () => {
      const result = getCurrentUTC();

      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      expect(dayjs(result).isValid()).toBe(true);
    });

    it('should return current time within 1 second', () => {
      const before = dayjs().utc();
      const result = getCurrentUTC();
      const after = dayjs().utc();

      const resultTime = dayjs(result);

      expect(resultTime.isAfter(before.subtract(1, 'second'))).toBe(true);
      expect(resultTime.isBefore(after.add(1, 'second'))).toBe(true);
    });
  });

  describe('isInPast', () => {
    it('should return true for past dates', () => {
      const pastDate = dayjs().subtract(1, 'day').toISOString();

      expect(isInPast(pastDate)).toBe(true);
    });

    it('should return false for future dates', () => {
      const futureDate = dayjs().add(1, 'day').toISOString();

      expect(isInPast(futureDate)).toBe(false);
    });

    it('should return true for dates 1 hour ago', () => {
      const pastDate = dayjs().subtract(1, 'hour').toISOString();

      expect(isInPast(pastDate)).toBe(true);
    });

    it('should return false for dates 1 hour in future', () => {
      const futureDate = dayjs().add(1, 'hour').toISOString();

      expect(isInPast(futureDate)).toBe(false);
    });
  });

  describe('formatAbsoluteTime', () => {
    it('should format date with default format', () => {
      const date = '2025-12-25T18:00:00.000Z';

      const result = formatAbsoluteTime(date);

      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should format date with custom format', () => {
      const date = '2025-12-25T18:00:00.000Z';

      const result = formatAbsoluteTime(date, 'YYYY-MM-DD');

      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

});
