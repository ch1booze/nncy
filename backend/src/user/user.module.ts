import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from 'src/utils/prisma.service';

@Module({
  imports: [ConfigModule],
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class UserModule {}
