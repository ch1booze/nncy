import * as argon2 from 'argon2';
import { MailService, MailTemplate } from 'src/providers/mail.service';
import { OTPService } from 'src/providers/otp.service';
import { PrismaService } from 'src/providers/prisma.service';
import { ResponseDTO } from 'src/utils/response.dto';

import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import {
  LoginDTO,
  PayloadDTO,
  ProfileDTO,
  ResetPasswordDTO,
  SignupDTO,
} from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
    private otpService: OTPService,
  ) {}

  private async validateUser(email: string, password: string) {
    const existingUser = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (!existingUser) return ResponseDTO.error('User does not exist.');

    if (!(await argon2.verify(existingUser.password, password)))
      return ResponseDTO.error('Password is incorrect.');

    return ResponseDTO.success('User is validated.', existingUser);
  }

  private async signPayload(payload: PayloadDTO) {
    const accessToken = await this.jwtService.signAsync(payload);
    return ResponseDTO.success('Access token has been issued.', accessToken);
  }

  async signup(signupDTO: SignupDTO) {
    const existingUser = await this.prismaService.user.findUnique({
      where: { email: signupDTO.email },
    });
    if (existingUser)
      return ResponseDTO.error('Email is already in use.', HttpStatus.CONFLICT);

    const hashedPassword = await argon2.hash(signupDTO.password);
    const newUser = await this.prismaService.user.create({
      data: {
        ...signupDTO,
        password: hashedPassword,
      },
    });

    const payload: PayloadDTO = {
      username: newUser.email,
      id: newUser.id,
    };

    const signupResponse = await this.signPayload(payload);
    signupResponse.statusCode = HttpStatus.CREATED;
    return signupResponse;
  }

  async login(loginDTO: LoginDTO) {
    const validateUserResponse = await this.validateUser(
      loginDTO.email,
      loginDTO.password,
    );

    if (!validateUserResponse.success) {
      validateUserResponse.statusCode = HttpStatus.BAD_REQUEST;
      return validateUserResponse;
    }

    const validatedUser = validateUserResponse.data;
    const payload: PayloadDTO = {
      username: validatedUser.email,
      id: validatedUser.id,
    };

    const loginResponse = await this.signPayload(payload);
    loginResponse.statusCode = HttpStatus.OK;
    return loginResponse;
  }

  async getProfile(email: string) {
    const existingUser = await this.prismaService.user.findUnique({
      where: { email },
    });
    const { firstName, lastName } = existingUser;
    const profile: ProfileDTO = { email, firstName, lastName };
    return ResponseDTO.success(
      'User profile has been retrieved.',
      profile,
      HttpStatus.OK,
    );
  }

  async sendVerificationEmail(email: string) {
    const profileResponse = await this.getProfile(email);
    const { firstName, lastName } = profileResponse.data;
    const name = `${firstName} ${lastName}`;

    const generatedOTPResponse = await this.otpService.generateOTP();
    const { secret, token } = generatedOTPResponse.data;
    const updatedUser = await this.prismaService.user.update({
      where: { email },
      data: { secret },
    });

    if (!updatedUser)
      return ResponseDTO.error("User's secret has not been set.");

    const sendMailResponse = await this.mailService.sendMail(
      email,
      name,
      token,
      MailTemplate.VERIFICATION,
    );
    sendMailResponse.statusCode = HttpStatus.OK;

    return sendMailResponse;
  }

  async verifyEmail(email: string, token: string) {
    const foundUser = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!foundUser) return ResponseDTO.error('User not found.');

    const validatedOTPResponse = await this.otpService.validateOTP(
      foundUser.secret,
      token,
    );

    if (!validatedOTPResponse.success) {
      validatedOTPResponse.statusCode = HttpStatus.BAD_REQUEST;
      return validatedOTPResponse;
    }

    const updatedUser = await this.prismaService.user.update({
      where: { email },
      data: {
        isVerified: true,
      },
    });

    if (!updatedUser)
      return ResponseDTO.error(
        "User's email verification status not updated.",
        HttpStatus.EXPECTATION_FAILED,
      );

    validatedOTPResponse.statusCode = HttpStatus.OK;
    return validatedOTPResponse;
  }

  async sendResetPasswordEmail(email: string) {
    const existingUser = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!existingUser)
      return ResponseDTO.error(
        'Email is not registered.',
        HttpStatus.BAD_REQUEST,
      );

    const { firstName, lastName } = existingUser;
    const name = `${firstName} ${lastName}`;

    const generatedOTPResponse = await this.otpService.generateOTP();
    const { secret, token } = generatedOTPResponse.data;
    const updatedUser = await this.prismaService.user.update({
      where: { email },
      data: { secret },
    });

    if (!updatedUser)
      return ResponseDTO.error("User's secret has not been set.");

    const sendMailResponse = await this.mailService.sendMail(
      email,
      name,
      token,
      MailTemplate.RESET_PASSWORD,
    );
    sendMailResponse.statusCode = HttpStatus.OK;
    return sendMailResponse;
  }

  async verifyResetPassword(resetPasswordDTO: ResetPasswordDTO) {
    const { email, token, password } = resetPasswordDTO;

    const foundUser = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!foundUser) return ResponseDTO.error('User not found.');

    const validatedOTPResponse = await this.otpService.validateOTP(
      foundUser.secret,
      token,
    );

    if (!validatedOTPResponse.success) {
      validatedOTPResponse.statusCode = HttpStatus.BAD_REQUEST;
      return validatedOTPResponse;
    }

    const hashedPassword = await argon2.hash(password);
    const updatedUser = await this.prismaService.user.update({
      where: { email },
      data: {
        password: hashedPassword,
      },
    });

    if (!updatedUser)
      return ResponseDTO.error(
        "User's email verification status not updated.",
        HttpStatus.EXPECTATION_FAILED,
      );

    validatedOTPResponse.statusCode = HttpStatus.OK;
    return validatedOTPResponse;
  }
}
