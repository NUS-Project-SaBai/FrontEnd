import moment from 'moment';

export function formatDate(
  date?: string,
  format?: 'date' | 'datetime'
): string {
  if (format == 'datetime') {
    return date
      ? moment(date).format('DD MMM YYYY HH:mm')
      : moment().format('DD MMM YYYY HH:mm');
  } else {
    return date
      ? moment(date).format('DD MMM YYYY')
      : moment().format('DD MMM YYYY');
  }
}
