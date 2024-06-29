import { createClient } from 'smtpexpress';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

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
    private jwtService: JwtService,
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

    const payload = { email, name };
    const token = await this.jwtService.signAsync(payload);

    switch (mailTemplate) {
      case MailTemplate.VERIFICATION:
        subject = 'Email Verification';
        message = `Verification Code: ${token}`;
        break;

      case MailTemplate.RESET_PASSWORD:
        subject = 'Password Reset Request';
        message = '<h1>Reset your password</h1>';
        break;

      default:
        throw new Error('Invalid email template');
    }

    this.mailClient.sendApi.sendMail({
      subject,
      message,
      sender: {
        name: 'Nancy',
        email: this.senderMail,
      },
      recipients: { name, email },
    });
  }

  async verifyEmail(token: string) {
    return this.jwtService.verifyAsync(token);
  }
}
