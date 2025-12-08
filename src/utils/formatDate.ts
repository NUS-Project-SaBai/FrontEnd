import { DateTime } from 'luxon';

/**
 * Formats a date string or DateTime object into a human-readable format.
 * @param date - The date string in ISO format. YYYY-MM-DDTHH:mm:ss.sssZ
 * @param format - The format to return the date in.
 *    - `date` for just the date, eg '07 Aug 2025',
 *    - `datetime` for date and time, eg '07 Aug 2025 14:30'.
 */
export function formatDate(
  date?: string,
  format?: 'date' | 'datetime'
): string {
  if (!date) {
    return format === 'datetime'
      ? DateTime.now().toFormat('dd MMM yyyy HH:mm')
      : DateTime.now().toFormat('dd MMM yyyy');
  } else {
    const dt = DateTime.fromISO(date);
    return format === 'date'
      ? dt.toFormat('dd MMM yyyy')
      : dt.toFormat('dd MMM yyyy HH:mm');
  }
}

/**
 * Checks if a consultation can still be edited (24 hours interval since creation)
 * @param consultDate - Date string of the consultation
 * returns true if the consultation can be edited (less than 24 hours)
 */

export function canEditConsult(consultDate: string): boolean {
  const consultDateTime = DateTime.fromISO(consultDate);
  const now = DateTime.now();
  const diff = now.diff(consultDateTime, 'hours').hours;
  return diff < 24;
}
