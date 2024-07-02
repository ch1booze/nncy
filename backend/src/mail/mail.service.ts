import { createClient } from 'smtpexpress';
import { ResponseDTO } from 'src/response.dto';

import { HttpStatus, Injectable } from '@nestjs/common';
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
        return ResponseDTO.error(
          HttpStatus.BAD_REQUEST,
          'Mail template is invalid.',
        );
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

    if (!sendMailResponse)
      return ResponseDTO.error(
        HttpStatus.FORBIDDEN,
        'Mail has failed to send.',
      );

    return ResponseDTO.success(
      HttpStatus.OK,
      'Mail has been sent successfully.',
    );
  }

  async verifyEmail(token: string) {
    const verificationDetails = await this.jwtService.verifyAsync(token);
    if (!verificationDetails)
      return ResponseDTO.error(
        HttpStatus.BAD_REQUEST,
        'Token is not verified.',
      );

    return ResponseDTO.success(
      HttpStatus.OK,
      'Token is verified.',
      verificationDetails,
    );
  }
}
