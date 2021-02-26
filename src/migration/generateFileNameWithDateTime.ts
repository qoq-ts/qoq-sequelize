import sanitize from 'sanitize-filename';

const zeroFill = (time: number): string => {
  return time < 10
    ? '0' + time
    : time.toString();
};

export const generateFileNameWithDateTime = (name: string): string => {
  const date = new Date();
  const dateString =
    zeroFill(date.getFullYear()) +
    zeroFill(date.getMonth() + 1) +
    zeroFill(date.getDate()) +
    zeroFill(date.getHours()) +
    zeroFill(date.getMinutes()) +
    zeroFill(date.getSeconds());

  return dateString + '-' + sanitize(name) + '.ts';
};
