import * as seedrandom from 'seedrandom';
import { ResponseDTO } from 'src/utils/response.dto';

import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { AccountStatus, AccountType } from '@prisma/client';

@Injectable()
export class OBPService {
  static NUMBER_OF_ACCOUNTS = 5;
  static ACCOUNT_TYPES: AccountType[] = [
    'Current',
    'Domiciliary',
    'Fixed',
    'Savings',
  ];
  static FOREIGN_CURRENCY_OPTIONS = ['USD', 'GBP', 'EUR', 'JPY', 'CNY'];

  async getAccountsLinkedToUser(bvn: string) {
    faker.seed(Number(bvn));
    seedrandom(Number(bvn));

    const accountsLinkedToUser = [];
    for (let i = 0; i < OBPService.NUMBER_OF_ACCOUNTS; i++) {
      const type: AccountType = faker.helpers.arrayElement(
        OBPService.ACCOUNT_TYPES,
      );

      const currencyCode =
        type !== AccountType.Domiciliary
          ? 'NGN'
          : faker.helpers.arrayElement(OBPService.FOREIGN_CURRENCY_OPTIONS);

      const status: AccountStatus = Math.random() < 0.9 ? 'Active' : 'Dormant';

      accountsLinkedToUser.push({
        number: faker.finance.accountNumber(10),
        openingDate: faker.date.past({ years: i + 1 }),
        type,
        currencyCode,
        status,
      });
    }

    return ResponseDTO.success(
      'Accounts linked to user have been retrieved.',
      accountsLinkedToUser,
    );
  }
}
