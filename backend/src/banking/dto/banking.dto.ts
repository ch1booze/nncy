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

export class AccountNumberDto {
  @IsNumberString()
  @IsNotEmpty()
  @Length(10)
  number: string;
}

export class BvnDto {
  @IsNumberString()
  @Length(10)
  bvn: string;
}

export class PhoneDto {
  @IsNumberString()
  @Length(11)
  phone: string;
}

export const accountSummary = {
  bankName: true,
  balance: true,
  number: true,
  currency: true,
};
