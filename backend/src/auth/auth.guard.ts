import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { expressJwtSecret } from 'jwks-rsa';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    return true;
  }
}
