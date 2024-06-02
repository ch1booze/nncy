import { IsNotEmpty, IsPhoneNumber, IsString, Length } from 'class-validator';

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

  @IsString()
  @IsNotEmpty()
  @Length(11, 11)
  bvn: string;
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
