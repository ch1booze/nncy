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

import { Injectable } from '@nestjs/common';

import { SignupDto, TokenDto } from './payload/user.dto';
import {
  EmailIsVerified,
  UserIsCreated,
  UserProfileIsRetrieved,
} from './payload/user.response';

@Injectable()
export class UserService {
  constructor(
    private databaseService: DatabaseService,
    private messagingService: MessagingService,
  ) {}

  async signup(userId: string, signupDto: SignupDto) {
    await this.databaseService.user.create({
      data: { id: userId, ...signupDto },
    });

    return ResponseDto.generateResponse(UserIsCreated);
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
