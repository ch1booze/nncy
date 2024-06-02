import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto, SignupDto } from './dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('send-verification-code')
  async sendVerificationCode(@Body() phoneNumber: string) {
    return this.userService.sendVerificationCode(phoneNumber);
  }

  @Post('verify-phone-number')
  async verifyPhoneNumber(@Body() verifyPhoneNumberDto) {
    return this.userService.verifyPhoneNumber(verifyPhoneNumberDto);
  }

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.userService.signup(signupDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }
}
