import { EmailProvider } from 'src/providers/email.provider';
import { BankingProvider } from 'src/providers/banking.provider';
import { OtpProvider } from 'src/providers/otp.provider';
import { DatabaseProvider } from 'src/providers/database.provider';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    DatabaseProvider,
    EmailProvider,
    OtpProvider,
    BankingProvider,
  ],
})
export class AuthModule {}
