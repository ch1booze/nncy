import * as argon2 from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { LoginDTO, PayloadDTO, SignupDTO } from './dto';
import { MailService, MailTemplate } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
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
    if (existingUser) throw new UnauthorizedException('Email already in use');

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
    if (!user) throw new UnauthorizedException('Invalid credentials');

    return this.signPayload({
      username: user.email,
      id: user.id,
    });
  }

  async getProfile(email: string) {
    const { firstName, lastName } = await this.findUserByEmail(email);
    return { email, firstName, lastName };
  }

  async sendVerificationEmail(email: string) {
    const { firstName, lastName } = await this.getProfile(email);
    const name = `${firstName} ${lastName}`;
    await this.mailService.sendMail(email, name, MailTemplate.VERIFICATION);
  }

  async verifyEmail(token: string) {
    const verificationDetails = await this.mailService.verifyEmail(token);
    if (verificationDetails) {
      await this.prismaService.user.update({
        where: {
          email: verificationDetails.email,
        },
        data: {
          isVerified: true,
        },
      });
      return true;
    } else return false;
  }
}
