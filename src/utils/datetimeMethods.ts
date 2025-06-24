import moment from 'moment';

export const stringToFormattedDate = (date: string) =>
  moment(date).format('DD MMM YYYY HH:mm');
