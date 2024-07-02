import { Request } from 'express';

import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginDTO, SignupDTO } from './dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiCreatedResponse({ description: 'User has signed up via email.' })
  async signup(@Body() signupDTO: SignupDTO) {
    return this.authService.signup(signupDTO);
  }

  @Post('login')
  @ApiOkResponse({ description: 'User has logged in via email.' })
  async login(@Body() loginDTO: LoginDTO) {
    return this.authService.login(loginDTO);
  }

  @Get('get-profile')
  @UseGuards(JwtAuthGuard)
  @ApiFoundResponse({ description: `User's profile has been retrieved.` })
  async getProfile(@Req() req: Request) {
    const user = req.user as any;
    return this.authService.getProfile(user.username);
  }

  @Get('send-verification-email')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'User has been sent verification email.' })
  async sendVerificationEmail(@Req() req: Request) {
    const { username: email } = req.user as any;
    return this.authService.sendVerificationEmail(email);
  }

  @Post('verify-email')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ description: 'User has verified email.' })
  async verifyEmail(@Body('token') token: string) {
    return this.authService.verifyEmail(token);
  }
}
