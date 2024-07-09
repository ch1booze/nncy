import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ResponseDTO } from 'src/utils/response.dto';

import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';

import { PayloadDTO } from './dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('Jwt_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: PayloadDTO) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (!token)
      return ResponseDTO.error('No token provided.', HttpStatus.UNAUTHORIZED);

    const decodedToken = this.jwtService.decode(token);
    if (!decodedToken)
      return ResponseDTO.error('Invalid token.', HttpStatus.UNAUTHORIZED);

    const user = { id: payload.id, email: payload.username };
    return ResponseDTO.success('User has been validated.', user, HttpStatus.OK);
  }
}
