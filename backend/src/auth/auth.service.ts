import { Injectable } from '@nestjs/common';
import { LoginDto, SignupDto } from './dto';
import { PrismaService } from 'src/prisma.service';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  async signup(signupDto: SignupDto) {
    const { password } = signupDto;
    const passwordHash = await argon2.hash(password);
    await this.prismaService.user.create({
      data: {
        phoneNumber: signupDto.phoneNumber,
        passwordHash: passwordHash,
        firstName: signupDto.firstName,
        lastName: signupDto.lastName,
      },
    });

    return signupDto;
  }

  async login(loginDto: LoginDto) {
    const user = await this.prismaService.user.findUnique({
      where: { phoneNumber: loginDto.phoneNumber },
    });
    if (!user) return 'User does not exist.';

    const { passwordHash } = user;
    const isMatched = await argon2.verify(passwordHash, loginDto.password);
    if (isMatched) return loginDto;
    else return 'Password is incorrect.';
  }
}
