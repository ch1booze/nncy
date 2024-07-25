import { Inject, Injectable } from '@nestjs/common';
import supertokens from 'supertokens-node';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import Session from 'supertokens-node/recipe/session';

import { AuthModuleConfig, ConfigInjectionToken } from './config.interface';
import { AuthService } from './auth.service';

@Injectable()
export class SupertokensService {
  constructor(
    @Inject(ConfigInjectionToken) private config: AuthModuleConfig,
    private authService: AuthService,
  ) {
    this.initializeSupertokens();
  }

  private initializeSupertokens(): void {
    supertokens.init({
      appInfo: this.config.appInfo,
      supertokens: {
        connectionURI: this.config.connectionURI,
        apiKey: this.config.apiKey,
      },
      recipeList: [EmailPassword.init(), this.configureSession()],
    });
  }

  private configureSession(): ReturnType<typeof Session.init> {
    return Session.init({
      override: {
        functions: (originalImplementation) => ({
          ...originalImplementation,
          createNewSession: this.createNewSessionOverride(
            originalImplementation,
          ),
        }),
      },
    });
  }

  private createNewSessionOverride(originalImplementation: any) {
    return async function (input: any) {
      console.log('Creating new session:', input);
      console.log(
        'Original URL:',
        input.userContext._default.request.getOriginalURL(),
      );

      const enhancedInput = {
        ...input,
        accessTokenPayload: {
          ...input.accessTokenPayload,
          someKey: 'someValue',
        },
      };

      return originalImplementation.createNewSession(enhancedInput);
    };
  }
}
