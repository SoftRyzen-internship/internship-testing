export const linkRegex =
  /^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\/])*)?/;

export const telegramRegex = /^https:\/\/t.me\/\w+$/;

export const phoneRegex = /^\+\d{10,12}$/;

export const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,32}$/;

export const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,}$/;
