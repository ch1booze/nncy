import Dinero from 'dinero.js';
import { PayloadDto } from 'src/auth/dto';
import { DatabaseProvider } from 'src/providers/database.provider';
import { ResponseDto } from 'src/utils/response.dto';
import {
  ACCOUNT_IS_EXPENDED,
  ACCOUNT_NOT_EXPENDABLE,
  ACCOUNT_NOT_FOUND,
  TRANSACTIONS_ARE_RETRIEVED,
} from 'src/utils/response.types';

import { Injectable } from '@nestjs/common';
import { TransactionType } from '@prisma/client';

import { ExpenseDto, TransactionFilterQueries } from './dto';

@Injectable()
export class TransactionService {
  constructor(private databaseProvider: DatabaseProvider) {}

  async sendMoney(user: PayloadDto, expenseDto: ExpenseDto) {
    const foundAccount = await this.databaseProvider.account.findUnique({
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

    await this.databaseProvider.account.update({
      where: { number: expenseDto.accountNumber },
      data: {
        balance: newBalance.getAmount(),
        transactions: {
          create: {
            ...expenseDto,
            type: TransactionType.Expense,
            userId: user.id,
          },
        },
      },
    });

    return ResponseDto.generateResponse(ACCOUNT_IS_EXPENDED);
  }

  async getTransactions(
    user: PayloadDto,
    transactionFilterQueries: TransactionFilterQueries,
  ) {
    const foundTransactions = this.databaseProvider.transaction.findMany({
      where: {
        userId: user.id,
        account: { id: transactionFilterQueries.accountId },
        type: transactionFilterQueries.transactionType,
      },
    });

    return ResponseDto.generateResponse(
      TRANSACTIONS_ARE_RETRIEVED,
      foundTransactions,
    );
  }
}
