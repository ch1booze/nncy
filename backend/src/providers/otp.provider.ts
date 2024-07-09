import * as speakeasy from 'speakeasy';
import { ResponseDto } from 'src/utils/response.dto';

import { Injectable } from '@nestjs/common';

@Injectable()
export class OtpProvider {
  async generateOtp() {
    const secret = speakeasy.generateSecret({ length: 20 });
    const token = speakeasy.totp({
      secret: secret.base32,
      encoding: 'base32',
    });
    return ResponseDto.success('Otp has been generated.', {
      secret: secret.base32,
      token,
    });
  }

  async validateOtp(secret: string, token: string) {
    const isValid = speakeasy.totp.verify({
      secret,
      token,
      encoding: 'base32',
      window: 25,
    });

    if (!isValid) return ResponseDto.error('Invalid Otp.');
    return ResponseDto.success('User is validated.');
  }
}
