import { ResponseDto } from 'src/utils/response.dto';
// import { Twilio } from 'twilio';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export enum SmsTemplate {
  Bvn_VERIFICATION = 'bvn-verification',
}

@Injectable()
export class SmsProvider {
  private smsClient;
  private senderPhone;

  constructor(private configService: ConfigService) {
    // this.senderPhone = this.configService.get<string>('TWILIO_SENDER_PHONE');
    // const accountSID = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    // const authToken = this.configService.get<string>('TWILIO_TEST_AUTH_TOKEN');
    // this.smsClient = new Twilio(accountSID, authToken);
  }

  async sendSms(phone: string, token: string, smsTemplate: SmsTemplate) {
    let subject;
    let message;

    switch (smsTemplate) {
      case SmsTemplate.Bvn_VERIFICATION:
        subject = 'Bvn Verification';
        message = `Your Otp Code: ${token}`;
        break;

      default:
        return ResponseDto.error('Sms template is invalid.');
    }

    // const sendSmsResponse = this.smsClient.messages.create({
    //   body: `${subject}:\n${message}`,
    //   from: this.senderPhone,
    //   to: phone,
    // });

    const sendSmsResponse =
      Math.random() < 0.9 ? `${subject}:\n${message}` : null;

    if (!sendSmsResponse) return ResponseDto.error('Sms has failed to send.');
    return ResponseDto.success('Sent', sendSmsResponse);
  }
}
