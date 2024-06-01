import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoginDto, SignupDto } from './dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private prismaService: PrismaService,
  ) {}

  signup(signupDto: SignupDto) {
    return signupDto;
  }

  login(loginDto: LoginDto) {
    return loginDto;
  }
}
