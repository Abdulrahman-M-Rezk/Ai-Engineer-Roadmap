import { describe, it, expect } from 'vitest';
import { getTodayLocal } from './dates';

describe('getTodayLocal', () => {
  it('returns the date in YYYY-MM-DD format', () => {
    expect(getTodayLocal()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('pads month and day with leading zeros', () => {
    const now = new Date();
    const expected =
      now.getFullYear() +
      '-' +
      String(now.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(now.getDate()).padStart(2, '0');
    expect(getTodayLocal()).toBe(expected);
  });
});