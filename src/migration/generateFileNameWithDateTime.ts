const zeroFill = (time: number): string => {
  if (time < 10) {
    return '0' + time;
  }

  return time.toString();
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

  return dateString + '-' + name + '.ts';
};
