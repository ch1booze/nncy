import { ResponseObject } from 'src/response/response.dto';

import { HttpStatus } from '@nestjs/common';

export const EmailIsVerified: ResponseObject = {
  status: HttpStatus.OK,
  message: 'Email is verified',
};

export const EmailNotVerified: ResponseObject = {
  status: HttpStatus.BAD_REQUEST,
  message: 'Email not verified',
};

export const UserAlreadyExists: ResponseObject = {
  status: HttpStatus.OK,
  message: 'User already exists',
};

export const UserIsAuthorized: ResponseObject = {
  status: HttpStatus.OK,
  message: 'User is authorized',
};

export const UserIsCreated: ResponseObject = {
  status: HttpStatus.CREATED,
  message: 'User is created',
};

export const UserNotAuthorized: ResponseObject = {
  status: HttpStatus.UNAUTHORIZED,
  message: 'User not authorized',
};

export const UserNotFound: ResponseObject = {
  status: HttpStatus.NOT_FOUND,
  message: 'User not found',
};

export const UserProfileIsRetrieved: ResponseObject = {
  status: HttpStatus.OK,
  message: 'User profile is retrieved',
};

export const TokenNotFound: ResponseObject = {
  status: HttpStatus.BAD_REQUEST,
  message: 'Token not found',
};
