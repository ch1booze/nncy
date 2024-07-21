import { dinero } from 'dinero.js';

import { NGN } from '@dinero.js/currencies';
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

import { TransferFundsDto } from './payload/banking.dto';

@Injectable()
export class TransferFundsPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const dineroAmount = dinero({
      amount: parseInt(value.amount),
      currency: NGN,
    });

    const transferFundsDto: TransferFundsDto = {
      amount: dineroAmount,
      description: value.description,
      transferAccountName: value.transferAccountName,
      transferAccountNumber: value.transferAccountNumber,
      transferBankCode: value.transferBankCode,
      primaryAccountNumber: value.primaryAccountNumber,
    };

    return transferFundsDto;
  }
}
