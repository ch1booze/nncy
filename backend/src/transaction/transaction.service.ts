import * as Dinero from 'dinero.js';
import { PrismaProvider } from 'src/providers/prisma.provider';
import { ResponseDTO } from 'src/utils/response.dto';

import { HttpStatus, Injectable } from '@nestjs/common';

import { ExpenseDTO } from './dto';
import { TransactionType } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(private prismaProvider: PrismaProvider) {}

  async sendMoney(id: string, expenseDTO: ExpenseDTO) {
    const userFromAccount = await this.prismaProvider.account.findUnique({
      where: { userId: id, number: expenseDTO.accountNumber },
    });

    if (!userFromAccount)
      return ResponseDTO.error(
        'Account number invalid',
        HttpStatus.BAD_REQUEST,
      );

    const accountBalance = Dinero({
      amount: parseInt(String(Number(userFromAccount.balance))),
      currency: userFromAccount.currency as Dinero.Currency,
    });

    const expense = Dinero({
      amount: parseInt(String(expenseDTO.amount)),
      currency: userFromAccount.currency as Dinero.Currency,
    });

    const canExpend = accountBalance.greaterThan(expense);
    if (!canExpend)
      return ResponseDTO.error(
        'Amount to be sent exceeds current balance.',
        HttpStatus.BAD_REQUEST,
      );

    const newBalance = accountBalance.subtract(expense);
    await this.prismaProvider.account.update({
      where: { number: expenseDTO.accountNumber },
      data: { balance: newBalance.getAmount() },
    });

    await this.prismaProvider.transaction.create({
      data: {
        ...expenseDTO,
        type: TransactionType.Outflow,
        userId: id,
      },
    });

    return ResponseDTO.success(
      'Account has been expended from',
      null,
      HttpStatus.OK,
    );
  }
}
