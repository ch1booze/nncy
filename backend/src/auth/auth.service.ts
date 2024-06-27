import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO, PayloadDTO, SignupDTO } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  private async findUserByEmail(email: string) {
    return this.prismaService.user.findUnique({ where: { email } });
  }

  private async validateUser(email: string, password: string) {
    const user = await this.findUserByEmail(email);
    if (user && (await argon2.verify(user.password, password))) {
      return user;
    }
    return null;
  }

  private signPayload(payload: PayloadDTO) {
    return { accessToken: this.jwtService.sign(payload) };
  }

  async signup(signupDTO: SignupDTO) {
    const existingUser = await this.findUserByEmail(signupDTO.email);
    if (existingUser) {
      // throw new UnauthorizedException('Email already in use');
      return 'Email already in use';
    }

    const hashedPassword = await argon2.hash(signupDTO.password);
    const newUser = await this.prismaService.user.create({
      data: {
        ...signupDTO,
        password: hashedPassword,
      },
    });

    return this.signPayload({
      username: newUser.email,
      id: newUser.id,
    });
  }

  async login(loginDTO: LoginDTO) {
    const user = await this.validateUser(loginDTO.email, loginDTO.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.signPayload({
      username: user.email,
      id: user.id,
    });
  }

  async getProfile(email: string) {
    return this.findUserByEmail(email);
  }
}
