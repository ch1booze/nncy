import * as Dinero from 'dinero.js';
import { PayloadDto } from 'src/auth/dto';
import { PrismaProvider } from 'src/providers/prisma.provider';
import { ResponseDto } from 'src/utils/response.dto';
import {
  ACCOUNT_IS_EXPENDED,
  ACCOUNT_NOT_EXPENDABLE,
  ACCOUNT_NOT_FOUND,
} from 'src/utils/response.types';

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TransactionType } from '@prisma/client';

import { ExpenseDto } from './dto';

@Injectable()
export class TransactionService {
  constructor(private prismaProvider: PrismaProvider) {}

  async sendMoney(user: PayloadDto, expenseDto: ExpenseDto) {
    const foundAccount = await this.prismaProvider.account.findUnique({
      where: { userId: user.id, number: expenseDto.accountNumber },
    });

    if (!foundAccount) {
      return ResponseDto.generateResponse(ACCOUNT_NOT_FOUND);
    }

    const accountBalance = Dinero({
      amount: parseInt(String(Number(foundAccount.balance))),
      currency: foundAccount.currency as Dinero.Currency,
    });
    const expense = Dinero({
      amount: parseInt(String(expenseDto.amount)),
      currency: foundAccount.currency as Dinero.Currency,
    });
    const canExpend = accountBalance.greaterThan(expense);
    if (!canExpend) {
      ResponseDto.generateResponse(ACCOUNT_NOT_EXPENDABLE);
    }

    const newBalance = accountBalance.subtract(expense);
    const updatedAccount = await this.prismaProvider.account.update({
      where: { number: expenseDto.accountNumber },
      data: { balance: newBalance.getAmount() },
    });
    if (!updatedAccount) {
      throw new InternalServerErrorException('Account not updated');
    }

    const createdTransaction = await this.prismaProvider.transaction.create({
      data: {
        ...expenseDto,
        type: TransactionType.Outflow,
        userId: user.id,
      },
    });
    if (!createdTransaction) {
      throw new InternalServerErrorException('Transaction not created');
    }

    return ResponseDto.generateResponse(ACCOUNT_IS_EXPENDED);
  }
}
