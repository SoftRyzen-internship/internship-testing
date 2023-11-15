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
