import { middleware } from 'supertokens-node/framework/express';

import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  supertokensMiddleware: any;

  constructor() {
    this.supertokensMiddleware = middleware();
  }

  use(req: Request, res: any, next: () => void) {
    return this.supertokensMiddleware(req, res, next);
  }
}
