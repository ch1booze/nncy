import { IsNotEmpty, IsNumberString, IsString, Length } from 'class-validator';

export class ExpenseDTO {
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
