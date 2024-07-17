import { createClient } from 'smtpexpress';
import * as speakeasy from 'speakeasy';
import { ResponseDto } from 'src/response/response.dto';
import { Injectable, NotImplementedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailIsSent, MessageDto, OtpDto, SmsIsSent, Template } from './dto';

@Injectable()
export class MessagingService {
  private emailClient;
  private senderEmail;
  private smsClient;
  private senderPhone;

  constructor(private configService: ConfigService) {
    console.log('Initializing MessagingService...');
    this.emailClient = createClient({
      projectId: this.configService.get<string>('SMTPEXPRESS_PROJECT_ID'),
      projectSecret: this.configService.get<string>(
        'SMTPEXPRESS_PROJECT_SECRET',
      ),
    });

    this.senderEmail = this.configService.get<string>(
      'SMTPEXPRESS_SENDER_EMAIL',
    );

    // this.senderPhone = this.configService.get<string>('TWILIO_SENDER_PHONE');
    // const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    // const authToken = this.configService.get<string>('TWILIO_TEST_AUTH_TOKEN');
    // this.smsClient = new Twilio(accountSid, authToken);
  }

  async generateOtp() {
    const secret = speakeasy.generateSecret({ length: 20 }).base32;
    const token = speakeasy.totp({ secret, encoding: 'base32' });
    const otpDto: OtpDto = { secret, token };

    return otpDto;
  }

  async validateOtp(otpDto: OtpDto) {
    const isValid = speakeasy.totp.verify({
      secret: otpDto.secret,
      token: otpDto.token,
      encoding: 'base32',
      window: 25,
    });

    return isValid;
  }

  async sendEmail(messageDto: MessageDto) {
    let subject: string;
    let message: string;

    switch (messageDto.template) {
      case Template.EMAIL_VERIFICATION:
        subject = 'Email Verification';
        message = `<h1>Verify your email: ${messageDto.token}</h1>`;
        break;

      case Template.PASSWORD_RESET:
        subject = 'Password Reset Request';
        message = `<h1>Reset your password: ${messageDto.token}</h1>`;
        break;

      default:
        throw new NotImplementedException('Mail template not implemented');
    }

    await this.emailClient.sendApi.sendMail({
      subject,
      message,
      sender: {
        name: 'Nancy',
        email: this.senderEmail,
      },
      recipients: { name: messageDto.name, email: messageDto.contact },
    });

    const sentEmail = `${subject} to ${messageDto.name}:\n${message}`;
    return ResponseDto.generateResponse(EmailIsSent, sentEmail);
  }

  async sendSms(messageDto: MessageDto) {
    let subject;
    let message;

    switch (messageDto.template) {
      case Template.BVN_VERIFICATION:
        subject = 'BVN Verification';
        message = `Your Otp Code: ${messageDto.token}`;
        break;

      default:
        throw new NotImplementedException('SMS template not implemented');
    }

    // Uncomment this block if using Twilio or another SMS service
    // await this.smsClient.messages.create({
    //   body: `${subject}:\n${message}`,
    //   from: this.senderPhone,
    //   to: messageDto.contact,
    // });

    const sentSms = `${subject} to ${messageDto.name}:\n${message}`;
    return ResponseDto.generateResponse(SmsIsSent, sentSms);
  }
}
