import {
  getSession,
  VerifySessionOptions,
} from 'supertokens-node/recipe/session';

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly getSessionOptions?: VerifySessionOptions) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
    const resp = ctx.getResponse();

    const session = await getSession(req, resp, this.getSessionOptions);
    req.session = session;
    return true;
  }
}
