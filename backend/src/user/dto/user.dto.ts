import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class SignupDto {
  @IsPhoneNumber('NG')
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;
}

export class LoginDto {
  @IsPhoneNumber('NG')
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class VerifyPhoneNumberDto {
  @IsPhoneNumber('NG')
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  verificationCode: string;
}

export class UpdateProfileDto {
  @IsPhoneNumber('NG')
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  firstName?: string;

  @IsString()
  lastName?: string;
}
