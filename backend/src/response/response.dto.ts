import { HttpStatus } from '@nestjs/common';

export interface ResponseObject {
  status: HttpStatus;
  message: string;
}

export class ResponseDto<T> {
  status: HttpStatus;
  message: string;
  data?: T;
  headers?: object;
  cookies?: object;

  constructor(
    responseObject: ResponseObject,
    data?: T,
    headers?: object,
    cookies?: object,
  ) {
    const { status, message } = responseObject;
    this.status = status;
    this.message = message;
    this.data = data;
    this.headers = headers;
    this.cookies = cookies;
  }

  static generateResponse<T>(
    responseObject: ResponseObject,
    data?: T,
    headers?: object,
    cookies?: object,
  ): ResponseDto<T> {
    return new ResponseDto(responseObject, data, headers, cookies);
  }
}
