import { HttpStatus } from '@nestjs/common';

export interface ResponseObject {
  status: HttpStatus;
  message: string;
}

export class ResponseDto<T> {
  status: HttpStatus;
  message: string;
  data?: T;

  constructor(responseObject: ResponseObject, data?: T) {
    const { status, message } = responseObject;
    this.status = status;
    this.message = message;
    this.data = data;
  }

  static generateResponse<T>(
    responseObject: ResponseObject,
    data?: T,
  ): ResponseDto<T> {
    return new ResponseDto(responseObject, data);
  }
}
