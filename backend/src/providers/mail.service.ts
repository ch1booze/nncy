import { createClient } from 'smtpexpress';
import { OTPService } from 'src/providers/otp.service';
import { PrismaService } from 'src/providers/prisma.service';
import { ResponseDTO } from 'src/utils/response.dto';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export enum MailTemplate {
  VERIFICATION = 'verification',
  RESET_PASSWORD = 'reset-password',
}

@Injectable()
export class MailService {
  private mailClient;
  private senderMail;

  constructor(
    private configService: ConfigService,
    private otpService: OTPService,
    private prismaService: PrismaService,
  ) {
    this.mailClient = createClient({
      projectId: this.configService.get<string>('SMTPEXPRESS_PROJECT_ID'),
      projectSecret: this.configService.get<string>(
        'SMTPEXPRESS_PROJECT_SECRET',
      ),
    });

    this.senderMail = this.configService.get<string>(
      'SMTPEXPRESS_SENDER_EMAIL',
    );
  }

  async sendMail(email: string, name: string, mailTemplate: MailTemplate) {
    let subject: string;
    let message: string;

    const generatedOTPResponse = await this.otpService.generateOTP();
    const { secret, token } = generatedOTPResponse.data;
    const updatedUser = await this.prismaService.user.update({
      where: { email },
      data: { secret },
    });

    if (!updatedUser)
      return ResponseDTO.error("User's secret has not been set.");

    switch (mailTemplate) {
      case MailTemplate.VERIFICATION:
        subject = 'Email Verification';
        message = `Your OTP Code: ${token}`;
        break;

      case MailTemplate.RESET_PASSWORD:
        subject = 'Password Reset Request';
        message = '<h1>Reset your password</h1>';
        break;

      default:
        return ResponseDTO.error('Mail template is invalid.');
    }

    const sendMailResponse = this.mailClient.sendApi.sendMail({
      subject,
      message,
      sender: {
        name: 'Nancy',
        email: this.senderMail,
      },
      recipients: { name, email },
    });

    if (!sendMailResponse) return ResponseDTO.error('Mail has failed to send.');
    return ResponseDTO.success('Mail has been sent successfully.');
  }

  async verifyEmail(email: string, token: string) {
    const foundUser = await this.prismaService.user.findUnique({
      where: { email },
    });

    const validatedOTPResponse = await this.otpService.validateOTP(
      foundUser.secret,
      token,
    );

    return validatedOTPResponse;
  }
}
