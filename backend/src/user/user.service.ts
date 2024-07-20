import * as argon2 from 'argon2';
import { DatabaseService } from 'src/database/database.service';
import { MessagingService } from 'src/messaging/messaging.service';
import {
  MessageDto,
  OtpDto,
  Template,
} from 'src/messaging/payload/messaging.dto';
import { OtpNotValid } from 'src/messaging/payload/messaging.response';
import { ResponseDto } from 'src/response/response.dto';

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import {
  EmailDto,
  LoginDto,
  ResetPasswordDto,
  SignupDto,
  TokenDto,
  UserDto,
} from './payload/user.dto';
import {
  EmailIsVerified,
  IncorrectPassword,
  PasswordIsReset,
  UserAlreadyExists,
  UserIsAuthorized,
  UserNotFound,
  UserProfileIsRetrieved,
} from './payload/user.response';

@Injectable()
export class UserService {
  constructor(
    private databaseService: DatabaseService,
    private jwtService: JwtService,
    private messagingService: MessagingService,
  ) {}

  private async authorizeUser(userDto: UserDto) {
    const accessToken = await this.jwtService.signAsync(userDto);
    return ResponseDto.generateResponse(UserIsAuthorized, accessToken);
  }

  async signup(signupDto: SignupDto) {
    const foundUser = await this.databaseService.user.findUnique({
      where: { email: signupDto.email },
    });
    if (foundUser) {
      return ResponseDto.generateResponse(UserAlreadyExists);
    }

    const hashedPassword = await argon2.hash(signupDto.password);
    const createdUser = await this.databaseService.user.create({
      data: {
        ...signupDto,
        password: hashedPassword,
      },
    });

    const userDto: UserDto = createdUser;
    return await this.authorizeUser(userDto);
  }

  async login(loginDto: LoginDto) {
    const foundUser = await this.databaseService.user.findUnique({
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

    const userDto: UserDto = foundUser;
    return await this.authorizeUser(userDto);
  }

  async getProfile(user: UserDto) {
    const ProfileSelectList = [
      'email',
      'firstName',
      'lastName',
      'isEmailVerified',
      'isBvnVerified',
      'dateOfBirth',
    ];
    const ProfileSelectFields =
      await this.databaseService.getSelectFields(ProfileSelectList);
    const foundProfile = await this.databaseService.user.findUnique({
      where: { id: user.id },
      select: ProfileSelectFields,
    });

    return ResponseDto.generateResponse(UserProfileIsRetrieved, foundProfile);
  }

  async sendVerificationEmail(user: UserDto) {
    const otpDto: OtpDto = await this.messagingService.generateOtp();
    const updatedUser = await this.databaseService.user.update({
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

  async verifyEmail(user: UserDto, tokenDto: TokenDto) {
    const foundUser = await this.databaseService.user.findUnique({
      where: { id: user.id },
    });

    const otpDto: OtpDto = { secret: foundUser.secret, token: tokenDto.token };
    const isValidatedOtp = await this.messagingService.validateOtp(otpDto);

    if (!isValidatedOtp) {
      return ResponseDto.generateResponse(OtpNotValid);
    }

    await this.databaseService.user.update({
      where: { id: user.id },
      data: { isEmailVerified: true },
    });

    return ResponseDto.generateResponse(EmailIsVerified);
  }

  async sendResetPasswordEmail(user: UserDto, emailDto: EmailDto) {
    const foundUser = await this.databaseService.user.findUnique({
      where: { email: emailDto.email },
    });
    if (!foundUser) {
      return ResponseDto.generateResponse(UserNotFound);
    }

    const otpDto: OtpDto = await this.messagingService.generateOtp();
    const updatedUser = await this.databaseService.user.update({
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

  async verifyResetPassword(user: UserDto, resetPasswordDto: ResetPasswordDto) {
    const foundUser = await this.databaseService.user.findUnique({
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
    await this.databaseService.user.update({
      where: { email: resetPasswordDto.email },
      data: { password: hashedPassword },
    });

    return ResponseDto.generateResponse(PasswordIsReset);
  }
}
