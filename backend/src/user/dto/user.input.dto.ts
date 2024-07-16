import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
  Matches,
  MinLength,
} from 'class-validator';

/** Password must:
 * contain at least one uppercase letter,
 * one lowercase letter,
 * one number,
 * one special character and,
 * must be at least 8 characters long.*/
const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8}$/;

const minPasswordLength = 8;
const tokenLength = 6;

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(minPasswordLength)
  @Matches(passwordPattern)
  password: string;
}

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class PayloadDto {
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class EmailDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class TokenDto {
  @IsNumberString()
  @IsNotEmpty()
  @Length(tokenLength)
  token: string;
}

export class ResetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNumberString()
  @IsNotEmpty()
  @Length(tokenLength)
  token: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(minPasswordLength)
  @Matches(passwordPattern)
  password: string;
}
