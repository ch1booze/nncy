import { HttpStatus } from '@nestjs/common';

export class ResponseDto<T> {
  success: boolean;
  message: string;
  data?: T;
  statusCode?: HttpStatus;

  constructor(
    success: boolean,
    message: string,
    data?: T,
    statusCode?: HttpStatus,
  ) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.statusCode = statusCode;
  }

  static success<T>(
    message: string,
    data?: T,
    statusCode?: HttpStatus,
  ): ResponseDto<T> {
    return new ResponseDto(true, message, data, statusCode);
  }

  static error(message: string, statusCode?: HttpStatus): ResponseDto<null> {
    return new ResponseDto(false, message, null, statusCode);
  }
}
