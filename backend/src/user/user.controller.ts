import { Session } from 'src/auth/session.decorator';
import { SessionContainer } from 'supertokens-node/recipe/session';

import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { SignupDto, TokenDto } from './payload/user.dto';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
@UseGuards(new AuthGuard())
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(
    @Session() session: SessionContainer,
    @Body() signupDto: SignupDto,
  ) {
    const userId = session.getUserId();
    return await this.userService.signup(userId, signupDto);
  }

  @Get('get-profile')
  async getProfile(@Session() session: SessionContainer) {
    const userId = session.getUserId();
    return await this.userService.getProfile(userId);
  }

  @Get('send-verification-email')
  async sendVerificationEmail(@Session() session: SessionContainer) {
    const userId = session.getUserId();
    return await this.userService.sendVerificationEmail(userId);
  }

  @Post('verify-email')
  async verifyEmail(
    @Session() session: SessionContainer,
    @Body() tokenDto: TokenDto,
  ) {
    const userId = session.getUserId();
    const recipeUserId = session.getRecipeUserId();
    return await this.userService.verifyEmail(userId, recipeUserId, tokenDto);
  }
}
