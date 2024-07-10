import { map, Observable } from 'rxjs';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((responseDto) => {
        const response = context.switchToHttp().getResponse();
        const { status, ...responseBody } = responseDto;
        response.status(status);
        return responseBody;
      }),
    );
  }
}
