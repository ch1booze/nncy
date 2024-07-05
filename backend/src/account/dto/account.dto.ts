import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';

export class AccountDTO {
  @IsNumberString()
  @IsNotEmpty()
  number: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsDate()
  @IsNotEmpty()
  openingDate: Date;

  @IsString()
  @IsNotEmpty()
  @Length(3)
  currency: string;

  @IsNumber()
  @IsNotEmpty()
  balance: number;

  @IsString()
  @IsNotEmpty()
  bankName: string;

  @IsPhoneNumber('NG')
  phoneNumber?: string;

  @IsEmail()
  email?: string;

  @IsString()
  userId?: string;
}

export class BVNDTO {
  @IsNumberString()
  @Length(10)
  bvn: string;
}
