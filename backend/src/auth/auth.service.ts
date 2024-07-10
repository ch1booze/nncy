import * as argon2 from 'argon2';
import {
  EmailProvider,
  EmailTemplate,
  SendEmailDto,
} from 'src/providers/email.provider';
import { OtpDto, OtpProvider } from 'src/providers/otp.provider';
import { PrismaProvider } from 'src/providers/prisma.provider';
import { ResponseDto } from 'src/utils/response.dto';
import {
  EMAIL_ALREADY_EXISTS,
  EMAIL_IS_VERIFIED,
  INCORRECT_PASSWORD,
  EMAIL_IS_SENT,
  OTP_NOT_VALID,
  PASSWORD_IS_RESET,
  USER_IS_AUTHORIZED,
  USER_NOT_FOUND,
  USER_PROFILE_IS_RETRIEVED,
} from 'src/utils/response.types';

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import type {
  EmailDto,
  LoginDto,
  PayloadDto,
  ProfileDto,
  ResetPasswordDto,
  SignupDto,
  TokenDto,
} from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prismaProvider: PrismaProvider,
    private jwtService: JwtService,
    private emailProvider: EmailProvider,
    private otpProvider: OtpProvider,
  ) {}

  async signup(signupDto: SignupDto) {
    const foundUser = await this.prismaProvider.user.findUnique({
      where: { email: signupDto.email },
    });
    if (foundUser) {
      return ResponseDto.generateResponse(EMAIL_ALREADY_EXISTS);
    }

    const hashedPassword = await argon2.hash(signupDto.password);
    const createdUser = await this.prismaProvider.user.create({
      data: {
        ...signupDto,
        password: hashedPassword,
      },
    });

    if (!createdUser) {
      throw new InternalServerErrorException('User not created');
    }

    const loginDto: LoginDto = createdUser;
    return await this.login(loginDto);
  }

  async login(loginDto: LoginDto) {
    const foundUser = await this.prismaProvider.user.findUnique({
      where: { email: loginDto.email },
    });
    if (!foundUser) {
      return ResponseDto.generateResponse(USER_NOT_FOUND);
    }

    const isPasswordMatched = await argon2.verify(
      foundUser.password,
      loginDto.password,
    );
    if (!isPasswordMatched) {
      return ResponseDto.generateResponse(INCORRECT_PASSWORD);
    }

    const payload: PayloadDto = foundUser;
    const accessToken = await this.jwtService.signAsync(payload);
    return ResponseDto.generateResponse(USER_IS_AUTHORIZED, accessToken);
  }

  async getProfile(user: PayloadDto) {
    const foundUser = await this.prismaProvider.user.findUnique({
      where: { id: user.id },
    });
    if (!foundUser) {
      return ResponseDto.generateResponse(USER_NOT_FOUND);
    }

    const profileDto: ProfileDto = foundUser;
    return ResponseDto.generateResponse(USER_PROFILE_IS_RETRIEVED, profileDto);
  }

  async sendVerificationEmail(user: PayloadDto) {
    const foundUser = await this.prismaProvider.user.findUnique({
      where: { id: user.id },
    });
    if (!foundUser) {
      return ResponseDto.generateResponse(USER_NOT_FOUND);
    }

    const otpDto: OtpDto = await this.otpProvider.generateOtp();
    const updatedUser = await this.prismaProvider.user.update({
      where: { id: foundUser.id },
      data: { secret: otpDto.secret },
    });
    if (!updatedUser) {
      throw new InternalServerErrorException('User not updated');
    }

    const sendEmailDto: SendEmailDto = {
      name: `${foundUser.firstName} ${foundUser.lastName}`,
      email: updatedUser.email,
      token: otpDto.token,
      emailTemplate: EmailTemplate.VERIFICATION,
    };
    const isSentMail = await this.emailProvider.sendEmail(sendEmailDto);

    if (!isSentMail) {
      throw new InternalServerErrorException('Mail not sent');
    }

    return ResponseDto.generateResponse(EMAIL_IS_SENT);
  }

  async verifyEmail(user: PayloadDto, tokenDto: TokenDto) {
    const foundUser = await this.prismaProvider.user.findUnique({
      where: { id: user.id },
    });
    if (!foundUser) {
      return ResponseDto.generateResponse(USER_NOT_FOUND);
    }

    const otpDto: OtpDto = { secret: foundUser.secret, token: tokenDto.token };
    const isValidatedOtp = await this.otpProvider.validateOtp(otpDto);
    if (!isValidatedOtp) {
      return ResponseDto.generateResponse(OTP_NOT_VALID);
    }

    const updatedUser = await this.prismaProvider.user.update({
      where: { id: user.id },
      data: { isEmailVerified: true },
    });
    if (!updatedUser) {
      throw new InternalServerErrorException('User not updated');
    }

    return ResponseDto.generateResponse(EMAIL_IS_VERIFIED);
  }

  async sendResetPasswordEmail(emailDto: EmailDto) {
    const foundUser = await this.prismaProvider.user.findUnique({
      where: { email: emailDto.email },
    });
    if (!foundUser) {
      return ResponseDto.generateResponse(USER_NOT_FOUND);
    }

    const otpDto: OtpDto = await this.otpProvider.generateOtp();
    const updatedUser = await this.prismaProvider.user.update({
      where: { id: foundUser.id },
      data: { secret: otpDto.secret },
    });
    if (!updatedUser) {
      throw new InternalServerErrorException('User not updated');
    }

    const sendEmailDto: SendEmailDto = {
      name: `${foundUser.firstName} ${foundUser.lastName}`,
      email: updatedUser.email,
      token: otpDto.token,
      emailTemplate: EmailTemplate.RESET_PASSWORD,
    };
    const isSentMail = await this.emailProvider.sendEmail(sendEmailDto);
    if (!isSentMail) {
      throw new InternalServerErrorException('Mail not sent');
    }

    return ResponseDto.generateResponse(EMAIL_IS_SENT);
  }

  async verifyResetPassword(resetPasswordDto: ResetPasswordDto) {
    const foundUser = await this.prismaProvider.user.findUnique({
      where: { email: resetPasswordDto.email },
    });
    if (!foundUser) {
      return ResponseDto.generateResponse(USER_NOT_FOUND);
    }

    const otpDto: OtpDto = {
      secret: foundUser.secret,
      token: resetPasswordDto.token,
    };
    const isValidatedOtp = await this.otpProvider.validateOtp(otpDto);
    if (!isValidatedOtp) {
      return ResponseDto.generateResponse(OTP_NOT_VALID);
    }

    const hashedPassword = await argon2.hash(resetPasswordDto.password);
    const updatedUser = await this.prismaProvider.user.update({
      where: { email: resetPasswordDto.email },
      data: { password: hashedPassword },
    });
    if (!updatedUser) {
      throw new InternalServerErrorException('User not updated');
    }

    return ResponseDto.generateResponse(PASSWORD_IS_RESET);
  }
}
