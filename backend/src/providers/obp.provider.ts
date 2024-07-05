import * as Dinero from 'dinero.js';
import * as seedrandom from 'seedrandom';
import { AccountDTO } from 'src/account/dto/account.dto';
import { ResponseDTO } from 'src/utils/response.dto';

import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { AccountStatus, AccountType } from '@prisma/client';

@Injectable()
export class OBPProvider {
  static NUMBER_OF_ACCOUNTS = 5;
  static ACCOUNT_TYPES: AccountType[] = ['Current', 'Fixed', 'Savings'];
  static BANK_NAMES = [
    'Access Bank',
    'CitiBank',
    'Ecobank',
    'First Bank',
    'Guaranty Trust Bank',
    'Kuda Bank',
    'Moniepoint',
    'OPay',
    'Palmpay',
    'United Bank of Africa',
    'Wema Bank',
    'Zenith Bank',
  ];

  async getAccountsLinkedToUser(bvn: string) {
    faker.seed(Number(bvn));
    seedrandom(Number(bvn));

    const accountsLinkedToUser: AccountDTO[] = [];
    for (let i = 0; i < OBPProvider.NUMBER_OF_ACCOUNTS; i++) {
      const type: AccountType = faker.helpers.arrayElement(
        OBPProvider.ACCOUNT_TYPES,
      );
      const bankName = faker.helpers.arrayElement(OBPProvider.BANK_NAMES);
      const status: AccountStatus = Math.random() < 0.9 ? 'Active' : 'Dormant';
      const balance = Dinero({
        amount: Number(faker.finance.amount({ min: 100000, max: 1000000 })),
        currency: 'NGN',
      }).getAmount();

      const account: AccountDTO = {
        number: faker.finance.accountNumber(10),
        openingDate: faker.date.past({ years: i + 1 }),
        balance,
        bankName,
        type,
        currency: 'NGN',
        status,
      };
      accountsLinkedToUser.push(account);
    }

    return ResponseDTO.success(
      'Accounts linked to user have been retrieved.',
      accountsLinkedToUser,
    );
  }
}
