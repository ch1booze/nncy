import { DatabaseService } from 'src/database/database.service';
import { MessagingService } from 'src/messaging/messaging.service';
import {
  MessageDto,
  OtpDto,
  Template,
} from 'src/messaging/payload/messaging.dto';
import { OtpNotValid } from 'src/messaging/payload/messaging.response';
import { ResponseDto } from 'src/response/response.dto';
import supertokens from 'supertokens-node';
import EmailVerification from 'supertokens-node/recipe/emailverification';
import { SessionContainer } from 'supertokens-node/recipe/session';

import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { SignupDto, TokenDto } from './payload/user.dto';
import {
  ClaimsIsSet,
  EmailIsVerified,
  UserAlreadyExists,
  UserIsCreated,
  UserProfileIsRetrieved,
} from './payload/user.response';

@Injectable()
export class UserService {
  constructor(
    private databaseService: DatabaseService,
    private httpService: HttpService,
    private messagingService: MessagingService,
  ) {}

  async signup(signupDto: SignupDto) {
    const formFields = {
      formFields: [
        { id: 'email', value: signupDto.email },
        { id: 'password', value: signupDto.password },
      ],
    };

    const signupResponse = await this.httpService.axiosRef
      .post('http://localhost:3001/auth/signup', formFields, {
        headers: {
          'Content-Type': 'application/json',
          rid: 'emailpassword',
        },
      })
      .then((response) => {
        const headers = response.headers;
        const data = response.data;
        return { data, headers };
      });

    if (signupResponse.data.status === 'OK') {
      const userData = {
        id: signupResponse.data.user.id,
        email: signupDto.email,
        firstName: signupDto.firstName,
        lastName: signupDto.lastName,
      };
      await this.databaseService.user.create({ data: userData });
      const cookies = {
        sAccessToken: signupResponse.headers['st-access-token'],
        sRefreshToken: signupResponse.headers['st-refresh-token'],
      };
      return ResponseDto.generateResponse(
        UserIsCreated,
        signupResponse.data,
        signupResponse.headers,
        cookies,
      );
    } else {
      return ResponseDto.generateResponse(UserAlreadyExists);
    }
  }

  async getClaims(session: SessionContainer) {
    const userId = session.getUserId();
    const foundUser = await this.databaseService.user.findUnique({
      where: { id: userId },
    });
    session.mergeIntoAccessTokenPayload({
      isBvnVerified: foundUser.isBvnVerified,
    });

    console.log(await this.databaseService.user.fields);
    return ResponseDto.generateResponse(ClaimsIsSet);
  }

  async getProfile(userId: string) {
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
      where: { id: userId },
      select: ProfileSelectFields,
    });

    return ResponseDto.generateResponse(UserProfileIsRetrieved, foundProfile);
  }

  async sendVerificationEmail(userId: string) {
    const otpDto: OtpDto = await this.messagingService.generateOtp();
    const updatedUser = await this.databaseService.user.update({
      where: { id: userId },
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

  async verifyEmail(
    userId: string,
    recipeUserId: supertokens.RecipeUserId,
    tokenDto: TokenDto,
  ) {
    const foundUser = await this.databaseService.user.findUnique({
      where: { id: userId },
    });

    const otpDto: OtpDto = { secret: foundUser.secret, token: tokenDto.token };
    const isValidatedOtp = await this.messagingService.validateOtp(otpDto);
    if (!isValidatedOtp) {
      return ResponseDto.generateResponse(OtpNotValid);
    }

    await this.changeEmailVerificationStatus(recipeUserId);
    await this.databaseService.user.update({
      where: { id: userId },
      data: { isEmailVerified: true },
    });

    return ResponseDto.generateResponse(EmailIsVerified);
  }

  private async changeEmailVerificationStatus(
    recipeUserId: supertokens.RecipeUserId,
  ) {
    const token = await EmailVerification.createEmailVerificationToken(
      'public',
      recipeUserId,
    );
    if (token.status === 'OK') {
      await EmailVerification.verifyEmailUsingToken('public', token.token);
    }
  }
}
