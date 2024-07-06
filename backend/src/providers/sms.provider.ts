import { ResponseDTO } from 'src/utils/response.dto';
// import { Twilio } from 'twilio';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export enum SMSTemplate {
  BVN_VERIFICATION = 'bvn-verification',
}

@Injectable()
export class SMSProvider {
  private smsClient;
  private senderPhone;

  constructor(private configService: ConfigService) {
    // this.senderPhone = this.configService.get<string>('TWILIO_SENDER_PHONE');
    // const accountSID = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    // const authToken = this.configService.get<string>('TWILIO_TEST_AUTH_TOKEN');
    // this.smsClient = new Twilio(accountSID, authToken);
  }

  async sendSMS(phone: string, token: string, smsTemplate: SMSTemplate) {
    let subject;
    let message;

    switch (smsTemplate) {
      case SMSTemplate.BVN_VERIFICATION:
        subject = 'BVN Verification';
        message = `Your OTP Code: ${token}`;
        break;

      default:
        return ResponseDTO.error('SMS template is invalid.');
    }

    // const sendSMSResponse = this.smsClient.messages.create({
    //   body: `${subject}:\n${message}`,
    //   from: this.senderPhone,
    //   to: phone,
    // });

    const sendSMSResponse =
      Math.random() < 0.9 ? `${subject}:\n${message}` : null;

    if (!sendSMSResponse) return ResponseDTO.error('SMS has failed to send.');
    return ResponseDTO.success('Sent', sendSMSResponse);
  }
}
