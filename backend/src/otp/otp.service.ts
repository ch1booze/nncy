import speakeasy from 'speakeasy';
import { ResponseDTO } from 'src/utils/response.dto';

import { Injectable } from '@nestjs/common';

@Injectable()
export class OtpService {
  async generateOTP() {
    const secret = speakeasy.generateSecret();
    const token = speakeasy.totp({ secret: secret.base32, encoding: 'base32' });
    return ResponseDTO.success('OTP has been generated.', {
      secret: secret.base32,
      token,
    });
  }

  async validateOTP(secret: any, token: string) {
    const isValid = speakeasy.totp.verify({
      secret: secret.base32,
      encoding: 'base32',
      token,
    });

    if (!isValid) return ResponseDTO.error('Invalid OTP.');
    return ResponseDTO.success('User is validated.');
  }
}
