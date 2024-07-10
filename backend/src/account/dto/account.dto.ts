import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';

import { AccountStatus, AccountType } from '@prisma/client';

export class AccountDto {
  @IsNumberString()
  @IsNotEmpty()
  number: string;

  @IsString()
  @IsNotEmpty()
  type: AccountType;

  @IsString()
  @IsNotEmpty()
  status: AccountStatus;

  @IsDate()
  @IsNotEmpty()
  openingDate: Date;

  @IsString()
  @IsNotEmpty()
  @Length(3)
  currency: string;

  @IsNumber()
  @IsNotEmpty()
  balance: number;

  @IsString()
  @IsNotEmpty()
  bankName: string;

  @IsPhoneNumber('NG')
  phoneNumber?: string;

  @IsEmail()
  email?: string;

  @IsString()
  userId: string;
}

export class BvnDto {
  @IsNumberString()
  @Length(10)
  bvn: string;
}

export class VerifyBvnDto {
  @IsNumberString()
  @Length(10)
  bvn: string;

  @IsNumberString()
  @Length(6)
  token: string;
}
