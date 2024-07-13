import { HttpStatus } from '@nestjs/common';

export interface ResponseType {
  status: HttpStatus;
  message: string;
}

// Accounts
export const ACCOUNT_IS_EXPENDED: ResponseType = {
  status: HttpStatus.OK,
  message: 'Account is expended',
};

export const ACCOUNT_IS_RETRIEVED: ResponseType = {
  status: HttpStatus.OK,
  message: 'Account is retrieved',
};

export const ACCOUNT_NOT_EXPENDABLE: ResponseType = {
  status: HttpStatus.BAD_REQUEST,
  message: 'Account not expendable',
};

export const ACCOUNT_NOT_FOUND: ResponseType = {
  status: HttpStatus.BAD_REQUEST,
  message: 'Account not found',
};

export const ACCOUNTS_ARE_LINKED: ResponseType = {
  status: HttpStatus.OK,
  message: 'Accounts are linked',
};

export const ACCOUNTS_ARE_RETRIEVED: ResponseType = {
  status: HttpStatus.OK,
  message: 'Accounts are retrieved',
};

export const ACCOUNTS_BALANCES_ARE_RETRIEVED: ResponseType = {
  status: HttpStatus.OK,
  message: 'Accounts balances are retrieved',
};

// BVN
export const BVN_IS_VERIFIED: ResponseType = {
  status: HttpStatus.OK,
  message: 'BVN is verified',
};

export const BVN_NOT_VERIFIED: ResponseType = {
  status: HttpStatus.BAD_REQUEST,
  message: 'BVN not verified',
};

// Email
export const EMAIL_ALREADY_EXISTS: ResponseType = {
  status: HttpStatus.CONFLICT,
  message: 'Email already exists',
};

export const EMAIL_IS_SENT: ResponseType = {
  status: HttpStatus.OK,
  message: 'Mail is sent',
};

export const EMAIL_IS_VERIFIED: ResponseType = {
  status: HttpStatus.OK,
  message: 'Email is verified',
};

export const EMAIL_NOT_FOUND: ResponseType = {
  status: HttpStatus.NOT_FOUND,
  message: 'Email not found',
};

export const EMAIL_NOT_VERIFIED: ResponseType = {
  status: HttpStatus.BAD_REQUEST,
  message: 'Email not verified',
};

// OTP
export const OTP_NOT_VALID: ResponseType = {
  status: HttpStatus.BAD_REQUEST,
  message: 'OTP not valid',
};

// Password
export const INCORRECT_PASSWORD: ResponseType = {
  status: HttpStatus.BAD_REQUEST,
  message: 'Incorrect password',
};

export const PASSWORD_IS_RESET: ResponseType = {
  status: HttpStatus.OK,
  message: 'Password is reset',
};

export const PASSWORD_NOT_RESET: ResponseType = {
  status: HttpStatus.BAD_REQUEST,
  message: 'Password not reset',
};

// SMS
export const SMS_IS_SENT: ResponseType = {
  status: HttpStatus.OK,
  message: 'SMS is sent',
};

// Token
export const TOKEN_NOT_FOUND: ResponseType = {
  status: HttpStatus.BAD_REQUEST,
  message: 'Token not found',
};

// Transaction
export const TRANSACTIONS_ARE_RETRIEVED: ResponseType = {
  status: HttpStatus.OK,
  message: 'Transactions are retrieved',
};

// User
export const USER_IS_AUTHORIZED: ResponseType = {
  status: HttpStatus.OK,
  message: 'User is authorized',
};

export const USER_IS_CREATED: ResponseType = {
  status: HttpStatus.CREATED,
  message: 'User is created',
};

export const USER_NOT_AUTHORIZED: ResponseType = {
  status: HttpStatus.UNAUTHORIZED,
  message: 'User not authorized',
};

export const USER_NOT_FOUND: ResponseType = {
  status: HttpStatus.NOT_FOUND,
  message: 'User not found',
};

export const USER_PROFILE_IS_RETRIEVED: ResponseType = {
  status: HttpStatus.OK,
  message: 'User profile is retrieved',
};

// Linked Accounts
export const LINKED_ACCOUNTS_ARE_RETRIEVED: ResponseType = {
  status: HttpStatus.OK,
  message: 'Linked accounts are retrieved',
};
