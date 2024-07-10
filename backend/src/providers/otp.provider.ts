import * as speakeasy from 'speakeasy';

import { Injectable } from '@nestjs/common';

export interface OtpDto {
  secret: string;
  token: string;
}

@Injectable()
export class OtpProvider {
  async generateOtp() {
    const secret = speakeasy.generateSecret({ length: 20 }).base32;
    const token = speakeasy.totp({
      secret,
      encoding: 'base32',
    });
    return { secret, token };
  }

  async validateOtp(otpDto: OtpDto) {
    const isValid = speakeasy.totp.verify({
      secret: otpDto.secret,
      token: otpDto.token,
      encoding: 'base32',
      window: 25,
    });

    if (!isValid) return false;
    return true;
  }
}
