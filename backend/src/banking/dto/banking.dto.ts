import {
  IsDate,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsPhoneNumber,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

import { AccountStatus, AccountType } from '@prisma/client';
import { Dinero } from 'dinero.js';

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

export class TransactionDto {
  @IsUUID()
  @IsNotEmpty()
  transactionId: string;

  @IsDateString()
  @IsNotEmpty()
  timestamp: string;

  @IsString()
  @IsNotEmpty()
  transactionType: TransactionType;

  @IsNotEmpty()
  amount: Dinero<number>;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  accountNumber: AccountNumberDto;

  @IsNotEmpty()
  balanceAfter: Dinero<number>;
}

export enum TransactionType {
  Credit = 'Credit',
  Debit = 'Debit',
}

export class TransactionFilters {
  accountNumbers?: AccountNumberDto[];

  @IsDateString()
  startDate?: string;

  @IsDateString()
  endDate?: string;

  @IsNumber()
  minAmount?: number;

  @IsNumber()
  maxAmount?: number;

  transactionType?: TransactionType;
}

interface AccountSummary {
  bankName: boolean;
  number: boolean;
  currencyCode: boolean;
}

export const accountSummary: AccountSummary = {
  bankName: true,
  number: true,
  currencyCode: true,
};
