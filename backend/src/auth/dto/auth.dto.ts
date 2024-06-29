import { IsEmail, IsString } from 'class-validator';

export class SignupDTO {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}

export class LoginDTO {
  @IsString()
  email: string;

  @IsString()
  password: string;
}

export class PayloadDTO {
  @IsString()
  username: string;

  @IsString()
  id: string;
}

export class ProfileDTO {
  email: string;
  firstName: string;
  lastName: string;
}
