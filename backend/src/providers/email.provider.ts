import { createClient } from 'smtpexpress';

import { Injectable, NotImplementedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export enum EmailTemplate {
  VERIFICATION,
  RESET_PASSWORD,
}

export interface SendEmailDto {
  email: string;
  name: string;
  token: string;
  emailTemplate: EmailTemplate;
}

@Injectable()
export class EmailProvider {
  private emailClient;
  private senderEmail;

  constructor(private configService: ConfigService) {
    this.emailClient = createClient({
      projectId: this.configService.get<string>('SMTPEXPRESS_PROJECT_ID'),
      projectSecret: this.configService.get<string>(
        'SMTPEXPRESS_PROJECT_SECRET',
      ),
    });

    this.senderEmail = this.configService.get<string>(
      'SMTPEXPRESS_SENDER_EMAIL',
    );
  }

  async sendEmail(sendEmailDto: SendEmailDto) {
    let subject: string;
    let message: string;

    switch (sendEmailDto.emailTemplate) {
      case EmailTemplate.VERIFICATION:
        subject = 'Email Verification';
        message = `<h1>Verify your email: ${sendEmailDto.token}</h1>`;
        break;

      case EmailTemplate.RESET_PASSWORD:
        subject = 'Password Reset Request';
        message = `<h1>Reset your password: ${sendEmailDto.token}</h1>`;
        break;

      default:
        throw new NotImplementedException('Mail template not implemented');
    }

    this.emailClient.sendApi.sendEmail({
      subject,
      message,
      sender: {
        name: 'Nancy',
        email: this.senderEmail,
      },
      recipients: { name: sendEmailDto.name, email: sendEmailDto.email },
    });
  }
}
