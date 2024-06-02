export class ResponseDto<T> {
  statusCode: number;
  message: string;
  error?: string;
  data?: T;
}
