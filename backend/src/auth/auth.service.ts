import * as argon2 from 'argon2';
import { MailService, MailTemplate } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponseDTO } from 'src/response.dto';

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
    if (!existingUser)
      return ResponseDTO.error(HttpStatus.NOT_FOUND, 'User does not exist.');

    if (!(await argon2.verify(existingUser.password, password)))
      return ResponseDTO.error(
        HttpStatus.UNAUTHORIZED,
        'Inputted password is incorrect.',
      );

    return ResponseDTO.success(
      HttpStatus.OK,
      `User's password is correct.`,
      existingUser,
    );
  }

  private async signPayload(payload: PayloadDTO) {
    const accessToken = await this.jwtService.signAsync(payload);
    return ResponseDTO.success(
      HttpStatus.OK,
      'Access token has been issued.',
      accessToken,
    );
  }

  async signup(signupDTO: SignupDTO) {
    const { email } = signupDTO;
    const existingUser = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (existingUser)
      return ResponseDTO.error(HttpStatus.CONFLICT, 'Email is already in use.');

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
    return this.signPayload(payload);
  }

  async login(loginDTO: LoginDTO) {
    const validateUserResponse = await this.validateUser(
      loginDTO.email,
      loginDTO.password,
    );

    if (validateUserResponse.error)
      return ResponseDTO.error(HttpStatus.UNAUTHORIZED, 'Invalid credentials.');

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
      HttpStatus.FOUND,
      'User profile has been retrieved.',
      profile,
    );
  }

  async sendVerificationEmail(email: string) {
    const profileResponse = await this.getProfile(email);
    const { firstName, lastName } = profileResponse.data;
    const name = `${firstName} ${lastName}`;

    await this.mailService.sendMail(email, name, MailTemplate.VERIFICATION);
  }

  async verifyEmail(token: string) {
    const verifyEmailResponse = await this.mailService.verifyEmail(token);
    if (verifyEmailResponse.error)
      return ResponseDTO.error(
        HttpStatus.BAD_REQUEST,
        `User wasn't be verified using email.`,
      );

    const verificationDetails = verifyEmailResponse.data;
    await this.prismaService.user.update({
      where: {
        email: verificationDetails.email,
      },
      data: {
        isVerified: true,
      },
    });
  }
}
