import {
  IsDate,
  IsEmail,
  IsNotEmpty,
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
  currencyCode: string;

  @IsString()
  @IsNotEmpty()
  bankName: string;

  @IsPhoneNumber('NG')
  phoneNumber?: string;

  @IsEmail()
  email?: string;
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

interface AccountSummary {
  bankName: boolean;
  balance: boolean;
  number: boolean;
  currency: boolean;
}

export const accountSummary: AccountSummary = {
  bankName: true,
  balance: true,
  number: true,
  currency: true,
};
