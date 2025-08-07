import { DateTime } from 'luxon';

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
