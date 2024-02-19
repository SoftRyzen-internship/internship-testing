export const getDateDeadline = (date: Date) => {
  const deadlineDate = new Date(date);
  deadlineDate.setHours(12);
  deadlineDate.setMinutes(0);
  const day = deadlineDate.getDate();
  const month = deadlineDate.getMonth() + 1;
  const year = deadlineDate.getFullYear();
  const hours = deadlineDate.getHours();
  const minutes = deadlineDate.getMinutes();

  return `${day.toString().padStart(2, '0')}.${month
    .toString()
    .padStart(2, '0')}.${year} ${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`;
};

export const registrationDateFormat = (date: string) => {
  const currentDate = new Date(date);
  currentDate.setHours(12);
  currentDate.setMinutes(0);
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  return `${day.toString().padStart(2, '0')}.${month
    .toString()
    .padStart(2, '0')}.${year}`;
};
