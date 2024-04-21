// REGEX
export const LINK_REGEX =
  /^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\/])*)?/;
export const TELEGRAM_REGEX = /^https:\/\/t.me\/\w+$/;
export const PHONE_REGEX = /^\+\d{10,13}$/;
export const PASSWORDS_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{6,32}$/;
export const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,}$/;

// PATH
export const VERIFY_EMAIL = 'email/verify-email';
export const VERIFY_EMAIL_PASS = 'passwords/verify';

// DEFAULT
export const SHEET_DEFAULT_NAME = 'All';
