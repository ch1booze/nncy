import { createClient } from 'smtpexpress';
import { ResponseDto } from 'src/utils/response.dto';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export enum MailTemplate {
  VERIFICATION = 'verification',
  RESET_PASSWORD = 'reset-password',
}

@Injectable()
export class MailProvider {
  private mailClient;
  private senderMail;

  constructor(private configService: ConfigService) {
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

  async sendMail(
    email: string,
    name: string,
    token: string,
    mailTemplate: MailTemplate,
  ) {
    let subject: string;
    let message: string;

    switch (mailTemplate) {
      case MailTemplate.VERIFICATION:
        subject = 'Email Verification';
        message = `<h1>Your Otp Code: ${token}</h1>`;
        break;

      case MailTemplate.RESET_PASSWORD:
        subject = 'Password Reset Request';
        message = `<h1>Reset your password: ${token}</h1>`;
        break;

      default:
        return ResponseDto.error('Mail template is invalid.');
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

    if (!sendMailResponse) return ResponseDto.error('Mail has failed to send.');
    return ResponseDto.success('Mail has been sent successfully.');
  }
}
