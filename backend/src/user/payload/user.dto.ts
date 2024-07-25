import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
} from 'class-validator';

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
}

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UserDto {
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
