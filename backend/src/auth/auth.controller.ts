import { User } from 'src/utils/user.decorator';

import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDTO, SignupDTO } from './dto';
import { JWTAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupDTO: SignupDTO) {
    return this.authService.signup(signupDTO);
  }

  @Post('login')
  async login(@Body() loginDTO: LoginDTO) {
    return this.authService.login(loginDTO);
  }

  @Get('get-profile')
  @UseGuards(JWTAuthGuard)
  async getProfile(@User() user: any) {
    const { email } = user;
    return this.authService.getProfile(email);
  }

  @Get('send-verification-email')
  @UseGuards(JWTAuthGuard)
  async sendVerificationEmail(@User() user: any) {
    const { email } = user;
    return this.authService.sendVerificationEmail(email);
  }

  @Post('verify-email')
  @UseGuards(JWTAuthGuard)
  async verifyEmail(@User() user: any, @Body('token') token: string) {
    const { email } = user;
    return this.authService.verifyEmail(email, token);
  }
}
