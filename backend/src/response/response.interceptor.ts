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
        const { status, headers, cookies, ...responseBody } = responseDto;
        response.set(headers);
        response.status(status);
        if (cookies) {
          for (const [key, value] of Object.entries(cookies)) {
            response.cookie(key, value);
          }
        }
        return responseBody;
      }),
    );
  }
}
