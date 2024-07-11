import { PayloadDto } from 'src/auth/dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/utils/user.decorator';

import { Body, Controller, Post, Query, UseGuards } from '@nestjs/common';

import { ExpenseDto, TransactionFilterQueries } from './dto';
import { TransactionService } from './transaction.service';

@Controller('transaction')
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}
  @Post('send-money')
  async sendMoney(@User() user: PayloadDto, @Body() expenseDto: ExpenseDto) {
    return await this.transactionService.sendMoney(user, expenseDto);
  }

  @Post('get-transactions')
  async getTransactions(
    @User() user: PayloadDto,
    @Query() transactionFilterQueries: TransactionFilterQueries,
  ) {
    return await this.transactionService.getTransactions(
      user,
      transactionFilterQueries,
    );
  }
}
