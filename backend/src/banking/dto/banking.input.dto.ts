import {
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
} from 'class-validator';

import { AccountStatus, AccountType, TransactionType } from '@prisma/client';
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

export class TransferAccountDto {
  @IsString()
  @IsNotEmpty()
  accountName: string;

  @IsIBAN()
  @IsNotEmpty()
  bankCode: string;

  @IsNotEmpty()
  accountNumber: AccountNumberDto;
}

export class TransferFundsDto {
  @IsString()
  @IsNotEmpty()
  transferAccountName: string;

  @IsNotEmpty()
  transferAccountNumber: AccountNumberDto;

  @IsIBAN()
  @IsNotEmpty()
  transferBankCode: string;

  @IsNotEmpty()
  amount: Dinero<number>;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  primaryAccount: AccountNumberDto;

  secondaryAccounts?: AccountNumberDto;
}

export class TransactionFilterParams {
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
