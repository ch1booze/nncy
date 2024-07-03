import * as argon2 from 'argon2';
import { MailService, MailTemplate } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseDTO } from 'src/utils/response.dto';

import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { LoginDTO, PayloadDTO, ProfileDTO, SignupDTO } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
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
    return this.signPayload(payload);
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

    return await this.mailService.sendMail(
      email,
      name,
      MailTemplate.VERIFICATION,
    );
  }

  async verifyEmail(email: string, token: string) {
    const verifyEmailResponse = await this.mailService.verifyEmail(
      email,
      token,
    );

    if (!verifyEmailResponse.success) {
      verifyEmailResponse.statusCode = HttpStatus.BAD_REQUEST;
      return verifyEmailResponse;
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

    verifyEmailResponse.statusCode = HttpStatus.OK;
    return verifyEmailResponse;
  }
}
