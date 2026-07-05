/**
 * Returns the current date as YYYY-MM-DD in Asia/Singapore time (UTC+8, no
 * DST), independent of the player's local timezone/locale.
 */
export function getSingaporeDateString(date = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Singapore',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}
