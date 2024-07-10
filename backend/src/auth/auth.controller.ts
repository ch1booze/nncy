import { User } from 'src/utils/user.decorator';

import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import type {
  EmailDto,
  LoginDto,
  PayloadDto,
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
  async getProfile(@User() user: PayloadDto) {
    return await this.authService.getProfile(user);
  }

  @Get('send-verification-email')
  @UseGuards(JwtAuthGuard)
  async sendVerificationEmail(@User() user: PayloadDto) {
    return await this.authService.sendVerificationEmail(user);
  }

  @Post('verify-email')
  @UseGuards(JwtAuthGuard)
  async verifyEmail(@User() user: PayloadDto, @Body() tokenDto: TokenDto) {
    return await this.authService.verifyEmail(user, tokenDto);
  }

  @Get('send-reset-password-email')
  async sendResetPasswordEmail(@Body() emailDto: EmailDto) {
    return await this.authService.sendResetPasswordEmail(emailDto);
  }

  @Patch('verify-reset-password')
  async verifyResetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.verifyResetPassword(resetPasswordDto);
  }

  @Get('test')
  async test() {
    throw new InternalServerErrorException('Teeeeeeeeessssssssssssssst');
  }
}
