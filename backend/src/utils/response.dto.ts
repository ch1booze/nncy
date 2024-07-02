import { HttpStatus } from '@nestjs/common';

export class ResponseDTO<T> {
  statusCode: HttpStatus;
  error: boolean;
  message: string;
  data?: T;

  constructor(
    statusCode: HttpStatus,
    error: boolean,
    message?: string,
    data?: T,
  ) {
    this.statusCode = statusCode;
    this.error = error;
    this.message = message;
    this.data = data;
  }

  static success<T>(
    statusCode: HttpStatus,
    message: string,
    data?: T,
  ): ResponseDTO<T> {
    return new ResponseDTO(statusCode, false, message, data);
  }

  static error(statusCode: HttpStatus, message: string): ResponseDTO<null> {
    return new ResponseDTO(statusCode, true, message, null);
  }
}
