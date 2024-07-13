import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
  Matches,
  MinLength,
} from 'class-validator';
import { Match } from 'src/utils/match.decorator';

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
  @MinLength(8)
  /** Password must:
   * contain at least one uppercase letter,
   * one lowercase letter,
   * one number,
   * one special character and,
   * must be at least 8 characters long.*/
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8}$/)
  password: string;

  @IsString()
  @IsNotEmpty()
  @Match('password')
  confirmPassword: string;
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
  @Length(6)
  token: string;
}

export class ResetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNumberString()
  @IsNotEmpty()
  @Length(6)
  token: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8}$/)
  password: string;

  @IsString()
  @IsNotEmpty()
  @Match('password')
  confirmPassword: string;
}

interface ProfileInclusionFields {
  email: boolean;
  firstName: boolean;
  lastName: boolean;
  isEmailVerified: boolean;
  isBvnVerified: boolean;
  dateOfBirth: boolean;
}

export const profileInclusionFields: ProfileInclusionFields = {
  email: true,
  firstName: true,
  lastName: true,
  isEmailVerified: true,
  isBvnVerified: true,
  dateOfBirth: true,
};
