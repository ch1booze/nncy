import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoginDto, SignupDto } from './dto';

@Injectable()
export class AuthService {
  constructor(private configService: ConfigService) {}

  signup(signupDto: SignupDto) {
    return signupDto;
  }

  login(loginDto: LoginDto) {
    return loginDto;
  }
}
