import { IsISO8601, IsNotEmpty, IsString } from 'class-validator';
import { Dinero } from 'dinero.js';

export class CreateBudgetDto {
  @IsString()
  @IsNotEmpty()
  category: string;

  @IsNotEmpty()
  totalAmount: Dinero<number>;

  @IsString()
  @IsNotEmpty()
  refreshCycle: string;

  @IsISO8601()
  @IsNotEmpty()
  startDate: string;
}
