import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { ExpenseDto } from './dto';
import { TransactionService } from './transaction.service';
import { User } from 'src/utils/user.decorator';

@Controller('transaction')
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}
  @Post('send-money')
  async sendMoney(@User() user: any, @Body() expenseDto: ExpenseDto) {
    const { id } = user;
    return await this.transactionService.sendMoney(id, expenseDto);
  }
}
