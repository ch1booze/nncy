import { User } from 'src/utils/user.decorator';

import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import {
  EmailDTO,
  LoginDTO,
  ResetPasswordDTO,
  SignupDTO,
  TokenDTO,
} from './dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupDTO: SignupDTO) {
    return await this.authService.signup(signupDTO);
  }

  @Post('login')
  async login(@Body() loginDTO: LoginDTO) {
    return await this.authService.login(loginDTO);
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
  async verifyEmail(@User() user: any, @Body() tokenDTO: TokenDTO) {
    const { token } = tokenDTO;
    const { email } = user;
    return await this.authService.verifyEmail(email, token);
  }

  @Get('send-reset-password-email')
  async sendResetPasswordEmail(@Body() emailDTO: EmailDTO) {
    const { email } = emailDTO;
    return await this.authService.sendResetPasswordEmail(email);
  }

  @Patch('verify-reset-password')
  async verifyResetPassword(@Body() resetPasswordDTO: ResetPasswordDTO) {
    return await this.authService.verifyResetPassword(resetPasswordDTO);
  }
}
