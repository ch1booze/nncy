import { Request } from 'express';

import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDTO, SignupDTO } from './dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { MailService, MailTemplate } from 'src/mail/mail.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private mailService: MailService,
  ) {}

  @Post('signup')
  async signup(@Body() signupDTO: SignupDTO) {
    return this.authService.signup(signupDTO);
  }

  @Post('login')
  async login(@Body() loginDTO: LoginDTO) {
    return this.authService.login(loginDTO);
  }

  @Get('get-profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: Request) {
    const user = req.user as any;
    return this.authService.getProfile(user.username);
  }

  @Get('send-verification-email')
  @UseGuards(JwtAuthGuard)
  async sendVerificationEmail(@Req() req: Request) {
    const { username: email } = req.user as any;
    const { firstName, lastName } = await this.authService.getProfile(email);
    const name = `${firstName} ${lastName}`;
    await this.mailService.sendMail(email, name, MailTemplate.VERIFICATION);
  }

  @Post('verify-email')
  @UseGuards(JwtAuthGuard)
  async verifyEmail(@Body('token') token: string) {
    return this.mailService.verifyEmail(token);
  }
}
