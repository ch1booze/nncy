import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((responseDto) => {
        const response = context.switchToHttp().getResponse();
        const { statusCode, ...responseBody } = responseDto;
        response.status(statusCode);
        return responseBody;
      }),
    );
  }
}
