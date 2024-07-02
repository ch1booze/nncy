import { HttpStatus } from '@nestjs/common';

export class ResponseDTO<T> {
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
  ): ResponseDTO<T> {
    return new ResponseDTO(true, message, data, statusCode);
  }

  static error(message: string, statusCode?: HttpStatus): ResponseDTO<null> {
    return new ResponseDTO(false, message, null, statusCode);
  }
}
