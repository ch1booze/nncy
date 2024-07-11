import { IsNotEmpty, IsNumberString, IsString, Length } from 'class-validator';
import { TransactionType } from '@prisma/client';

export class ExpenseDto {
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumberString()
  @IsNotEmpty()
  @Length(10)
  accountNumber: string;
}

export class TransactionFilterQueries {
  accountId?: string;
  transactionType?: TransactionType;
}
