import { Controller, Post, Body, Get, Put, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginDto, SignupDto, UpdateProfileDto } from './dto';

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

  @Get('get-profile/:phoneNumber')
  async getProfile(@Param('phoneNumber') phoneNumber: string) {
    return await this.userService.getProfile(phoneNumber);
  }

  @Put('update-profile')
  async updateProfile(@Body() updateProfileDto: UpdateProfileDto) {
    return this.userService.updateProfile(updateProfileDto);
  }
}
