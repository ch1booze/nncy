import { HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto, SignupDto, VerifyPhoneNumberDto } from './dto';
import { PrismaService } from 'src/utils/prisma.service';
import * as argon2 from 'argon2';
import { ResponseDto } from 'src/utils/response.dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async sendVerificationCode(phoneNumber: string): Promise<ResponseDto<null>> {
    return {
      statusCode: HttpStatus.OK,
      message: `Sent verification code to ${phoneNumber}.`,
    };
  }

  async verifyPhoneNumber(
    verifyPhoneNumberDto: VerifyPhoneNumberDto,
  ): Promise<ResponseDto<null>> {
    const { phoneNumber, verificationCode } = verifyPhoneNumberDto;
    if (verificationCode === phoneNumber.slice(phoneNumber.length - 4)) {
      return {
        statusCode: HttpStatus.OK,
        message: 'User has been verified.',
      };
    } else {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: `User can't been verified.`,
      };
    }
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

  async login(
    loginDto: LoginDto,
  ): Promise<ResponseDto<{ loginDto: LoginDto } | null>> {
    const user = await this.prismaService.user.findUnique({
      where: { phoneNumber: loginDto.phoneNumber },
    });
    if (!user)
      return {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: `User does not exist.`,
      };

    const { passwordHash } = user;
    const isMatched = await argon2.verify(passwordHash, loginDto.password);
    if (isMatched)
      return {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: `User has been logged in .`,
        data: { loginDto },
      };
    else
      return {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: `Password incorrect.`,
      };
  }
}
