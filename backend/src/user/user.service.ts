import { Injectable } from '@nestjs/common';
import { LoginDto, SignupDto, VerifyPhoneNumberDto } from './dto';
import { PrismaService } from 'src/utils/prisma.service';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async sendVerificationCode(phoneNumber: string) {
    return `Send verification code to ${phoneNumber}.`;
  }

  async verifyPhoneNumber(verifyPhoneNumberDto: VerifyPhoneNumberDto) {
    const { phoneNumber, verificationCode } = verifyPhoneNumberDto;
    if (verificationCode === phoneNumber.slice(phoneNumber.length - 4))
      return 'User has been verified';
    else return `Invalid verification code.`;
  }

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

    return this.login({
      phoneNumber: signupDto.phoneNumber,
      password: signupDto.password,
    });
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
