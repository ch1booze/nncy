import * as argon2 from 'argon2';
import { MailProvider, MailTemplate } from 'src/providers/mail.provider';
import { OtpProvider } from 'src/providers/otp.provider';
import { PrismaProvider } from 'src/providers/prisma.provider';
import { ResponseDto } from 'src/utils/response.dto';

import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import {
  LoginDto,
  PayloadDto,
  ProfileDto,
  ResetPasswordDto,
  SignupDto,
} from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prismaProvider: PrismaProvider,
    private jwtService: JwtService,
    private mailProvider: MailProvider,
    private otpProvider: OtpProvider,
  ) {}

  private async validateUser(email: string, password: string) {
    const existingUser = await this.prismaProvider.user.findUnique({
      where: { email },
    });
    if (!existingUser) return ResponseDto.error('User does not exist.');

    if (!(await argon2.verify(existingUser.password, password)))
      return ResponseDto.error('Password is incorrect.');

    return ResponseDto.success('User is validated.', existingUser);
  }

  private async signPayload(payload: PayloadDto) {
    const accessToken = await this.jwtService.signAsync(payload);
    return ResponseDto.success('Access token has been issued.', accessToken);
  }

  async signup(signupDto: SignupDto) {
    const existingUser = await this.prismaProvider.user.findUnique({
      where: { email: signupDto.email },
    });
    if (existingUser)
      return ResponseDto.error('Email is already in use.', HttpStatus.CONFLICT);

    const hashedPassword = await argon2.hash(signupDto.password);
    const newUser = await this.prismaProvider.user.create({
      data: {
        ...signupDto,
        password: hashedPassword,
      },
    });

    const payload: PayloadDto = {
      username: newUser.email,
      id: newUser.id,
    };

    const signupResponse = await this.signPayload(payload);
    signupResponse.statusCode = HttpStatus.CREATED;
    return signupResponse;
  }

  async login(loginDto: LoginDto) {
    const validateUserResponse = await this.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!validateUserResponse.success) {
      validateUserResponse.statusCode = HttpStatus.BAD_REQUEST;
      return validateUserResponse;
    }

    const validatedUser = validateUserResponse.data;
    const payload: PayloadDto = {
      username: validatedUser.email,
      id: validatedUser.id,
    };

    const loginResponse = await this.signPayload(payload);
    loginResponse.statusCode = HttpStatus.OK;
    return loginResponse;
  }

  async getProfile(email: string) {
    const existingUser = await this.prismaProvider.user.findUnique({
      where: { email },
    });
    const { firstName, lastName } = existingUser;
    const profile: ProfileDto = { email, firstName, lastName };
    return ResponseDto.success(
      'User profile has been retrieved.',
      profile,
      HttpStatus.OK,
    );
  }

  async sendVerificationEmail(email: string) {
    const profileResponse = await this.getProfile(email);
    const { firstName, lastName } = profileResponse.data;
    const name = `${firstName} ${lastName}`;

    const generatedOtpResponse = await this.otpProvider.generateOtp();
    const { secret, token } = generatedOtpResponse.data;
    const updatedUser = await this.prismaProvider.user.update({
      where: { email },
      data: { secret },
    });

    if (!updatedUser)
      return ResponseDto.error("User's secret has not been set.");

    const sentMailResponse = await this.mailProvider.sendMail(
      email,
      name,
      token,
      MailTemplate.VERIFICATION,
    );

    if (!sentMailResponse.success) {
      sentMailResponse.statusCode = HttpStatus.BAD_REQUEST;
      return sentMailResponse;
    }

    sentMailResponse.statusCode = HttpStatus.OK;
    return sentMailResponse;
  }

  async verifyEmail(email: string, token: string) {
    const foundUser = await this.prismaProvider.user.findUnique({
      where: { email },
    });

    if (!foundUser) return ResponseDto.error('User not found.');

    const validatedOtpResponse = await this.otpProvider.validateOtp(
      foundUser.secret,
      token,
    );

    if (!validatedOtpResponse.success) {
      validatedOtpResponse.statusCode = HttpStatus.BAD_REQUEST;
      return validatedOtpResponse;
    }

    const updatedUser = await this.prismaProvider.user.update({
      where: { email },
      data: {
        isEmailVerified: true,
      },
    });

    if (!updatedUser)
      return ResponseDto.error(
        "User's email verification status not updated.",
        HttpStatus.EXPECTATION_FAILED,
      );

    validatedOtpResponse.statusCode = HttpStatus.OK;
    return validatedOtpResponse;
  }

  async sendResetPasswordEmail(email: string) {
    const existingUser = await this.prismaProvider.user.findUnique({
      where: { email },
    });

    if (!existingUser)
      return ResponseDto.error(
        'Email is not registered.',
        HttpStatus.BAD_REQUEST,
      );

    const { firstName, lastName } = existingUser;
    const name = `${firstName} ${lastName}`;

    const generatedOtpResponse = await this.otpProvider.generateOtp();
    const { secret, token } = generatedOtpResponse.data;
    const updatedUser = await this.prismaProvider.user.update({
      where: { email },
      data: { secret },
    });

    if (!updatedUser)
      return ResponseDto.error("User's secret has not been set.");

    const sendMailResponse = await this.mailProvider.sendMail(
      email,
      name,
      token,
      MailTemplate.RESET_PASSWORD,
    );
    sendMailResponse.statusCode = HttpStatus.OK;
    return sendMailResponse;
  }

  async verifyResetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email, token, password } = resetPasswordDto;

    const foundUser = await this.prismaProvider.user.findUnique({
      where: { email },
    });

    if (!foundUser) return ResponseDto.error('User not found.');

    const validatedOtpResponse = await this.otpProvider.validateOtp(
      foundUser.secret,
      token,
    );

    if (!validatedOtpResponse.success) {
      validatedOtpResponse.statusCode = HttpStatus.BAD_REQUEST;
      return validatedOtpResponse;
    }

    const hashedPassword = await argon2.hash(password);
    const updatedUser = await this.prismaProvider.user.update({
      where: { email },
      data: {
        password: hashedPassword,
      },
    });

    if (!updatedUser)
      return ResponseDto.error(
        "User's email verification status not updated.",
        HttpStatus.EXPECTATION_FAILED,
      );

    validatedOtpResponse.statusCode = HttpStatus.OK;
    return validatedOtpResponse;
  }
}
