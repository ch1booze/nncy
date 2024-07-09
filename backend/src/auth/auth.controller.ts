import { User } from 'src/utils/user.decorator';

import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import {
  EmailDto,
  LoginDto,
  ResetPasswordDto,
  SignupDto,
  TokenDto,
} from './dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return await this.authService.signup(signupDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Get('get-profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@User() user: any) {
    const { email } = user;
    return await this.authService.getProfile(email);
  }

  @Get('send-verification-email')
  @UseGuards(JwtAuthGuard)
  async sendVerificationEmail(@User() user: any) {
    const { email } = user;
    return await this.authService.sendVerificationEmail(email);
  }

  @Post('verify-email')
  @UseGuards(JwtAuthGuard)
  async verifyEmail(@User() user: any, @Body() tokenDto: TokenDto) {
    const { token } = tokenDto;
    const { email } = user;
    return await this.authService.verifyEmail(email, token);
  }

  @Get('send-reset-password-email')
  async sendResetPasswordEmail(@Body() emailDto: EmailDto) {
    const { email } = emailDto;
    return await this.authService.sendResetPasswordEmail(email);
  }

  @Patch('verify-reset-password')
  async verifyResetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.verifyResetPassword(resetPasswordDto);
  }
}
