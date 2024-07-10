import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { ExpenseDto } from './dto';
import { TransactionService } from './transaction.service';
import { User } from 'src/utils/user.decorator';
import { PayloadDto } from 'src/auth/dto';

@Controller('transaction')
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}
  @Post('send-money')
  async sendMoney(@User() user: PayloadDto, @Body() expenseDto: ExpenseDto) {
    return await this.transactionService.sendMoney(user, expenseDto);
  }
}
