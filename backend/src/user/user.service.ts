import * as argon2 from 'argon2';
import { MessageDto, OtpDto, OtpNotValid, Template } from 'src/messaging/dto';
import { MessagingService } from 'src/messaging/messaging.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseDto } from 'src/response/response.dto';

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import {
  EmailDto,
  EmailIsVerified,
  IncorrectPassword,
  LoginDto,
  PasswordIsReset,
  PayloadDto,
  ResetPasswordDto,
  SignupDto,
  TokenDto,
  UserAlreadyExists,
  UserIsAuthorized,
  UserNotFound,
  UserProfileIsRetrieved,
} from './dto';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private messagingService: MessagingService,
  ) {}

  private async authorizeUser(payloadDto: PayloadDto) {
    const accessToken = await this.jwtService.signAsync(payloadDto);
    return ResponseDto.generateResponse(UserIsAuthorized, accessToken);
  }

  async signup(signupDto: SignupDto) {
    const foundUser = await this.prismaService.user.findUnique({
      where: { email: signupDto.email },
    });
    if (foundUser) {
      return ResponseDto.generateResponse(UserAlreadyExists);
    }

    const hashedPassword = await argon2.hash(signupDto.password);
    const createdUser = await this.prismaService.user.create({
      data: {
        ...signupDto,
        password: hashedPassword,
      },
    });

    const payloadDto: PayloadDto = createdUser;
    return await this.authorizeUser(payloadDto);
  }

  async login(loginDto: LoginDto) {
    const foundUser = await this.prismaService.user.findUnique({
      where: { email: loginDto.email },
    });
    if (!foundUser) {
      return ResponseDto.generateResponse(UserNotFound);
    }

    const isPasswordMatched = await argon2.verify(
      foundUser.password,
      loginDto.password,
    );
    if (!isPasswordMatched) {
      return ResponseDto.generateResponse(IncorrectPassword);
    }

    const payloadDto: PayloadDto = foundUser;
    return await this.authorizeUser(payloadDto);
  }

  async getProfile(user: PayloadDto) {
    const ProfileSelectList = [
      'email',
      'firstName',
      'lastName',
      'isEmailVerified',
      'isBvnVerified',
      'dateOfBirth',
    ];
    const ProfileSelectFields =
      await this.prismaService.getSelectFields(ProfileSelectList);
    const foundProfile = await this.prismaService.user.findUnique({
      where: { id: user.id },
      select: ProfileSelectFields,
    });

    return ResponseDto.generateResponse(UserProfileIsRetrieved, foundProfile);
  }

  async sendVerificationEmail(user: PayloadDto) {
    const otpDto: OtpDto = await this.messagingService.generateOtp();
    const updatedUser = await this.prismaService.user.update({
      where: { id: user.id },
      data: { secret: otpDto.secret },
    });

    const sendEmailDto: MessageDto = {
      name: `${updatedUser.firstName} ${updatedUser.lastName}`,
      token: otpDto.token,
      template: Template.EMAIL_VERIFICATION,
      contact: updatedUser.email,
    };

    return await this.messagingService.sendEmail(sendEmailDto);
  }

  async verifyEmail(user: PayloadDto, tokenDto: TokenDto) {
    const foundUser = await this.prismaService.user.findUnique({
      where: { id: user.id },
    });

    const otpDto: OtpDto = { secret: foundUser.secret, token: tokenDto.token };
    const isValidatedOtp = await this.messagingService.validateOtp(otpDto);

    if (!isValidatedOtp) {
      return ResponseDto.generateResponse(OtpNotValid);
    }

    await this.prismaService.user.update({
      where: { id: user.id },
      data: { isEmailVerified: true },
    });

    return ResponseDto.generateResponse(EmailIsVerified);
  }

  async sendResetPasswordEmail(user: PayloadDto, emailDto: EmailDto) {
    const foundUser = await this.prismaService.user.findUnique({
      where: { email: emailDto.email },
    });
    if (!foundUser) {
      return ResponseDto.generateResponse(UserNotFound);
    }

    const otpDto: OtpDto = await this.messagingService.generateOtp();
    const updatedUser = await this.prismaService.user.update({
      where: { id: user.id },
      data: { secret: otpDto.secret },
    });

    const sendEmailDto: MessageDto = {
      name: `${updatedUser.firstName} ${updatedUser.lastName}`,
      token: otpDto.token,
      template: Template.PASSWORD_RESET,
      contact: emailDto.email,
    };

    return await this.messagingService.sendEmail(sendEmailDto);
  }

  async verifyResetPassword(
    user: PayloadDto,
    resetPasswordDto: ResetPasswordDto,
  ) {
    const foundUser = await this.prismaService.user.findUnique({
      where: { id: user.id },
    });

    const otpDto: OtpDto = {
      secret: foundUser.secret,
      token: resetPasswordDto.token,
    };
    const isValidatedOtp = await this.messagingService.validateOtp(otpDto);
    if (!isValidatedOtp) {
      return ResponseDto.generateResponse(OtpNotValid);
    }

    const hashedPassword = await argon2.hash(resetPasswordDto.password);
    await this.prismaService.user.update({
      where: { email: resetPasswordDto.email },
      data: { password: hashedPassword },
    });

    return ResponseDto.generateResponse(PasswordIsReset);
  }
}
