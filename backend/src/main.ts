import supertokens from 'supertokens-node';

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { SupertokensExceptionFilter } from './auth/auth.filter';
import * as SuperTokensConfig from './config';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['error'] });
  app.use(cookieParser());
  app.enableCors({
    origin: [SuperTokensConfig.appInfo.websiteDomain],
    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
    credentials: true,
  });
  app.useGlobalFilters(new SupertokensExceptionFilter());
  await app.listen(3001);
}
bootstrap();
