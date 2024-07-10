// import { Twilio } from 'twilio';
import {
  Injectable,
  // InternalServerErrorException,
  NotImplementedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export enum SmsTemplate {
  BVN_VERIFICATION,
}

export interface SendSmsDto {
  phone: string;
  name: string;
  token: string;
  smsTemplate: SmsTemplate;
}

@Injectable()
export class SmsProvider {
  private smsClient;
  private senderPhone;

  constructor(private configService: ConfigService) {
    // this.senderPhone = this.configService.get<string>('TWILIO_SENDER_PHONE');
    // const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    // const authToken = this.configService.get<string>('TWILIO_TEST_AUTH_TOKEN');
    // this.smsClient = new Twilio(accountSid, authToken);
  }

  async sendSms(sendSmsDto: SendSmsDto) {
    let subject;
    let message;

    switch (sendSmsDto.smsTemplate) {
      case SmsTemplate.BVN_VERIFICATION:
        subject = 'BVN Verification';
        message = `Your Otp Code: ${sendSmsDto.token}`;
        break;

      default:
        throw new NotImplementedException('SMS template not implemented');
    }

    // this.smsClient.messages.create({
    //   body: `${subject}:\n${message}`,
    //   from: this.senderPhone,
    //   to: sendSmsDto.phone,
    // });

    return `${subject} to ${sendSmsDto.name}:\n${message}`;
  }
}
