import supertokens from 'supertokens-node';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import Session from 'supertokens-node/recipe/session';

import { Inject, Injectable } from '@nestjs/common';

import { AuthModuleConfig, ConfigInjectionToken } from './config.interface';

@Injectable()
export class SupertokensService {
  constructor(@Inject(ConfigInjectionToken) private config: AuthModuleConfig) {
    this.initializeSupertokens();
  }

  private initializeSupertokens(): void {
    supertokens.init({
      appInfo: this.config.appInfo,
      supertokens: {
        connectionURI: this.config.connectionURI,
        apiKey: this.config.apiKey,
      },
      recipeList: [EmailPassword.init(), Session.init()],
    });
  }
}
