import { ResponseObject } from 'src/response/response.dto';

import { HttpStatus } from '@nestjs/common';

export const EmailIsSent: ResponseObject = {
  status: HttpStatus.OK,
  message: 'Mail is sent',
};

export const OtpNotValid: ResponseObject = {
  status: HttpStatus.BAD_REQUEST,
  message: 'OTP not valid',
};

export const SmsIsSent: ResponseObject = {
  status: HttpStatus.OK,
  message: 'SMS is sent',
};
