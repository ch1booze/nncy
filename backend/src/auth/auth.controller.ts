import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDTO, SignupDTO } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(JwtAuthGuard)
  async login(@Body() loginDTO: LoginDTO) {
    return this.authService.login(loginDTO);
  }

  @Post('signup')
  @UseGuards(JwtAuthGuard)
  async signup(@Body() signupDTO: SignupDTO) {
    return this.authService.signup(signupDTO);
  }
}
