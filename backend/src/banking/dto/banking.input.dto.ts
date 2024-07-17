import {
  IsArray,
  IsDate,
  IsDateString,
  IsEmail,
  IsIBAN,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsPhoneNumber,
  IsString,
  IsUUID,
  Length,
  ValidateNested,
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
  @Length(13)
  phone: string;
}

export enum TransactionType {
  Credit = 'Credit',
  Debit = 'Debit',
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

  @IsNumberString()
  @IsNotEmpty()
  @Length(10)
  accountNumber: string;

  @IsNotEmpty()
  balanceAfter: Dinero<number>;
}

export class TransferAccountDto {
  @IsString()
  @IsNotEmpty()
  accountName: string;

  @IsIBAN()
  @IsNotEmpty()
  bankCode: string;

  @IsNumberString()
  @IsNotEmpty()
  @Length(10)
  accountNumber: string;
}

export class TransferFundsDto {
  @IsNotEmpty()
  amount: Dinero<number>;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  transferAccountName: string;

  @IsIBAN()
  @IsNotEmpty()
  transferBankCode: string;

  @IsNumberString()
  @IsNotEmpty()
  @Length(10)
  transferAccountNumber: string;

  @IsNumberString()
  @IsNotEmpty()
  @Length(10)
  primaryAccountNumber: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Length(10)
  secondaryAccountNumbers?: string[];
}

export class TransactionFilterParams {
  @IsArray()
  @ValidateNested({ each: true })
  @IsNumberString()
  @Length(10)
  accountNumbers?: string[];

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
