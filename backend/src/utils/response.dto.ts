import { HttpStatus } from '@nestjs/common';

import { ResponseType } from './response.types';

export class ResponseDto<T> {
  status: HttpStatus;
  message: string;
  data?: T;

  constructor(responseType: ResponseType, data?: T) {
    const { status, message } = responseType;
    this.status = status;
    this.message = message;
    this.data = data;
  }

  static generateResponse<T>(
    responseType: ResponseType,
    data?: T,
  ): ResponseDto<T> {
    return new ResponseDto(responseType, data);
  }
}
