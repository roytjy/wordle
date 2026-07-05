import { describe, it, expect } from 'vitest';
import { getSingaporeDateString } from '../singaporeDate.js';

describe('getSingaporeDateString', () => {
  it('formats as YYYY-MM-DD', () => {
    expect(getSingaporeDateString(new Date('2026-07-05T12:00:00Z'))).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('stays on the same SGT day just before midnight SGT (UTC 15:59)', () => {
    expect(getSingaporeDateString(new Date('2026-07-05T15:59:00Z'))).toBe('2026-07-05');
  });

  it('rolls over to the next SGT day just after midnight SGT (UTC 16:01)', () => {
    expect(getSingaporeDateString(new Date('2026-07-05T16:01:00Z'))).toBe('2026-07-06');
  });

  it('is independent of the host timezone (explicit Asia/Singapore, not local)', () => {
    // UTC 00:30 is already 08:30 SGT the same calendar day
    expect(getSingaporeDateString(new Date('2026-01-01T00:30:00Z'))).toBe('2026-01-01');
  });
});
