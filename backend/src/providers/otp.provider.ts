import * as speakeasy from 'speakeasy';
import { ResponseDTO } from 'src/utils/response.dto';

import { Injectable } from '@nestjs/common';

@Injectable()
export class OTPProvider {
  async generateOTP() {
    const secret = speakeasy.generateSecret({ length: 20 });
    const token = speakeasy.totp({
      secret: secret.base32,
      encoding: 'base32',
    });
    return ResponseDTO.success('OTP has been generated.', {
      secret: secret.base32,
      token,
    });
  }

  async validateOTP(secret: string, token: string) {
    const isValid = speakeasy.totp.verify({
      secret,
      token,
      encoding: 'base32',
      window: 25,
    });

    if (!isValid) return ResponseDTO.error('Invalid OTP.');
    return ResponseDTO.success('User is validated.');
  }
}
