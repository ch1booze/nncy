import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('get-verification-code')
  async sendVerificationCode(@Body() phoneNumber: string) {
    return this.authService.sendVerificationCode(phoneNumber);
  }

  @Post('verify-phone-number')
  async verifyPhoneNumber(@Body() verifyPhoneNumberDto) {
    return this.authService.verifyPhoneNumber(verifyPhoneNumberDto);
  }

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
