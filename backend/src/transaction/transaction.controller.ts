import { JWTAuthGuard } from 'src/auth/jwt-auth.guard';

import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { ExpenseDTO } from './dto';
import { TransactionService } from './transaction.service';
import { User } from 'src/utils/user.decorator';

@Controller('transaction')
@UseGuards(JWTAuthGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}
  @Post('send-money')
  async sendMoney(@User() user: any, @Body() expenseDTO: ExpenseDTO) {
    const { id } = user;
    return await this.transactionService.sendMoney(id, expenseDTO);
  }
}
