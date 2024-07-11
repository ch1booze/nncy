import { HttpStatus } from '@nestjs/common';

export interface ResponseType {
  status: HttpStatus;
  message: string;
}

// User
export const USER_IS_CREATED: ResponseType = {
  status: HttpStatus.CREATED,
  message: 'User is created',
};

export const USER_IS_AUTHORIZED: ResponseType = {
  status: HttpStatus.OK,
  message: 'User is authorized',
};

export const USER_PROFILE_IS_RETRIEVED: ResponseType = {
  status: HttpStatus.OK,
  message: 'User profile is retrieved',
};

export const USER_NOT_FOUND: ResponseType = {
  status: HttpStatus.NOT_FOUND,
  message: 'User not found',
};

export const USER_NOT_AUTHORIZED: ResponseType = {
  status: HttpStatus.UNAUTHORIZED,
  message: 'User not authorized',
};

// Password
export const PASSWORD_IS_RESET: ResponseType = {
  status: HttpStatus.OK,
  message: 'Password is reset',
};

export const INCORRECT_PASSWORD: ResponseType = {
  status: HttpStatus.BAD_REQUEST,
  message: 'Incorrect password',
};

export const PASSWORD_NOT_RESET: ResponseType = {
  status: HttpStatus.BAD_REQUEST,
  message: 'Password not reset',
};

// Email
export const EMAIL_IS_SENT: ResponseType = {
  status: HttpStatus.OK,
  message: 'Mail is sent',
};

export const EMAIL_IS_VERIFIED: ResponseType = {
  status: HttpStatus.OK,
  message: 'Email is verified',
};

export const EMAIL_ALREADY_EXISTS: ResponseType = {
  status: HttpStatus.CONFLICT,
  message: 'Email already exists',
};

export const EMAIL_NOT_FOUND: ResponseType = {
  status: HttpStatus.NOT_FOUND,
  message: 'Email not found',
};

export const EMAIL_NOT_VERIFIED: ResponseType = {
  status: HttpStatus.BAD_REQUEST,
  message: 'Email not verified',
};

// SMS
export const SMS_IS_SENT: ResponseType = {
  status: HttpStatus.BAD_REQUEST,
  message: 'SMS is sent',
};

// OTP
export const OTP_NOT_VALID: ResponseType = {
  status: HttpStatus.BAD_REQUEST,
  message: 'OTP not valid',
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

export const LINKED_ACCOUNTS_ARE_RETRIEVED: ResponseType = {
  status: HttpStatus.OK,
  message: 'Linked accounts are retrieved',
};

export const ACCOUNTS_ARE_LINKED: ResponseType = {
  status: HttpStatus.OK,
  message: 'Accounts are linked',
};

export const ACCOUNT_NOT_FOUND: ResponseType = {
  status: HttpStatus.BAD_REQUEST,
  message: 'Account not found',
};

export const ACCOUNT_NOT_EXPENDABLE: ResponseType = {
  status: HttpStatus.BAD_REQUEST,
  message: 'Account not expendable',
};

export const ACCOUNT_IS_EXPENDED: ResponseType = {
  status: HttpStatus.OK,
  message: 'Account is expended',
};

export const TOKEN_NOT_FOUND: ResponseType = {
  status: HttpStatus.BAD_REQUEST,
  message: 'Token not found',
};

export const ACCOUNTS_ARE_RETRIEVED: ResponseType = {
  status: HttpStatus.OK,
  message: 'Accounts are retrieved',
};
