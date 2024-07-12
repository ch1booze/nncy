import Dinero from 'dinero.js';
import * as seedrandom from 'seedrandom';
import { AccountDto, BvnDto } from 'src/account/dto/account.dto';

import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { AccountStatus, AccountType } from '@prisma/client';

@Injectable()
export class BankingProvider {
  static NUMBER_OF_ACCOUNTS = 3;
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
  static CURRENCY: Dinero.Currency = 'NGN';

  async getAccountsLinkedToUser(id: string, bvn: string) {
    faker.seed(Number(bvn));
    seedrandom(Number(bvn));

    const accountsLinkedToUser: AccountDto[] = [];
    for (let i = 0; i < BankingProvider.NUMBER_OF_ACCOUNTS; i++) {
      const type: AccountType = faker.helpers.arrayElement(
        BankingProvider.ACCOUNT_TYPES,
      );
      const bankName = faker.helpers.arrayElement(BankingProvider.BANK_NAMES);
      const status: AccountStatus = Math.random() < 0.9 ? 'Active' : 'Dormant';
      const balance = Dinero({
        amount: parseInt(
          faker.finance.amount({ min: 100000, max: 1000000 }),
          10,
        ),
        currency: BankingProvider.CURRENCY,
      }).getAmount();

      const account: AccountDto = {
        number: faker.finance.accountNumber(10),
        openingDate: faker.date.past({ years: i + 1 }),
        balance,
        bankName,
        type,
        currency: BankingProvider.CURRENCY,
        status,
        userId: id,
      };
      accountsLinkedToUser.push(account);
    }

    return accountsLinkedToUser;
  }

  async getPhoneLinkedToBvn(bvnDto: BvnDto) {
    faker.seed(Number(bvnDto.bvn));

    const phoneLinkedToBvn = `+234-${faker.phone.number()}`.replace('-', '');
    return { phone: phoneLinkedToBvn };
  }
}
