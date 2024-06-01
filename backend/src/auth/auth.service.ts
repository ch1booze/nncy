import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto';

@Injectable()
export class AuthService {
  constructor(private configService: ConfigService) {}

  login(loginDto: LoginDto) {
    return loginDto;
  }
}
