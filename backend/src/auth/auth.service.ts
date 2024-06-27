import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (!user) return null;
    const isPasswordMatched = await argon2.verify(password, user.password);
    if (isPasswordMatched) return `${user} has validated.`;
    else return null;
  }

  async login(user: any) {
    const payload = { username: user.email, sub: user.id };
    return { accessToken: this.jwtService.sign(payload) };
  }
}
