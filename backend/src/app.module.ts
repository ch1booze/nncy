import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BankingModule } from './banking/banking.module';
import { DatabaseModule } from './database/database.module';
import { HttpExceptionFilter } from './http-exception.filter';
import { MessagingModule } from './messaging/messaging.module';
import { ObpModule } from './obp/obp.module';
import { ResponseInterceptor } from './response/response.interceptor';
import { UserModule } from './user/user.module';
import { AgentModule } from './agent/agent.module';

@Module({
  imports: [
    BankingModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    MessagingModule,
    ObpModule,
    UserModule,
    AgentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
  ],
})
export class AppModule {}
