import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ResponseDto } from 'src/response/response.dto';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';

import {
  PayloadDto,
  TokenNotFound,
  UserIsAuthorized,
  UserNotAuthorized,
} from './dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (!token) {
      return ResponseDto.generateResponse(TokenNotFound);
    }

    const verifiedPayload = await this.jwtService.verifyAsync(token);
    if (!verifiedPayload) {
      return ResponseDto.generateResponse(UserNotAuthorized);
    }

    const user: PayloadDto = verifiedPayload;
    return ResponseDto.generateResponse(UserIsAuthorized, user);
  }
}
