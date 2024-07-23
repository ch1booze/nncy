import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';

import { AgentModule } from './agent/agent.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BankingModule } from './banking/banking.module';
import { BudgetModule } from './budget/budget.module';
import { DatabaseModule } from './database/database.module';
import { MessagingModule } from './messaging/messaging.module';
import { ObpModule } from './obp/obp.module';
import { ResponseInterceptor } from './response/response.interceptor';
import { UserModule } from './user/user.module';
import { HttpExceptionFilter } from './utils/http-exception.filter';

@Module({
  imports: [
    AuthModule.forRoot({
      connectionURI: 'https://try.supertokens.com',
      appInfo: {
        appName: 'nancy',
        apiDomain: 'http://localhost:3000',
        websiteDomain: 'http://localhost:3000',
        apiBasePath: '/auth',
        websiteBasePath: '/auth',
      },
    }),
    AgentModule,
    BudgetModule,
    BankingModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    MessagingModule,
    ObpModule,
    ScheduleModule.forRoot(),
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
  ],
})
export class AppModule {}
