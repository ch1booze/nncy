import { User } from 'src/user/user.decorator';

import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';

import { UserService } from './user.service';
import type {
  EmailDto,
  LoginDto,
  UserDto,
  ResetPasswordDto,
  SignupDto,
  TokenDto,
} from './payload';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return await this.userService.signup(signupDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.userService.login(loginDto);
  }

  @Get('get-profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@User() user: UserDto) {
    return await this.userService.getProfile(user);
  }

  @Get('send-verification-email')
  @UseGuards(JwtAuthGuard)
  async sendVerificationEmail(@User() user: UserDto) {
    return await this.userService.sendVerificationEmail(user);
  }

  @Post('verify-email')
  @UseGuards(JwtAuthGuard)
  async verifyEmail(@User() user: UserDto, @Body() tokenDto: TokenDto) {
    return await this.userService.verifyEmail(user, tokenDto);
  }

  @Get('send-reset-password-email')
  async sendResetPasswordEmail(
    @User() user: UserDto,
    @Body() emailDto: EmailDto,
  ) {
    return await this.userService.sendResetPasswordEmail(user, emailDto);
  }

  @Patch('verify-reset-password')
  async verifyResetPassword(
    @User() user: UserDto,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return await this.userService.verifyResetPassword(user, resetPasswordDto);
  }
}
