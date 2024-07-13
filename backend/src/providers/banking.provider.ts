import { dinero } from 'dinero.js';
import * as seedrandom from 'seedrandom';
import {
  AccountDto,
  AccountNumberDto,
  BvnDto,
} from 'src/banking/dto/banking.dto';

import { NGN } from '@dinero.js/currencies';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { AccountStatus, AccountType } from '@prisma/client';

const accountTypes: AccountType[] = ['Current', 'Fixed', 'Savings'];
const bankNames = ['Access Bank', 'First Bank', 'Kuda Bank', 'OPay'];
const currencyCode = NGN.code;
const numberOfAccounts = 3;

@Injectable()
export class BankingProvider {
  async getAccountsLinkedToBvn(bvnDto: BvnDto) {
    faker.seed(Number(bvnDto.bvn));
    seedrandom(Number(bvnDto.bvn));

    const accountsLinkedToBvn: AccountDto[] = [];
    for (let i = 0; i < numberOfAccounts; i++) {
      const type: AccountType = faker.helpers.arrayElement(accountTypes);
      const bankName = faker.helpers.arrayElement(bankNames);
      const status: AccountStatus = Math.random() < 0.9 ? 'Active' : 'Dormant';
      const number = faker.finance.accountNumber(10);
      const openingDate = faker.date.past({ years: i + 1 });

      const account: AccountDto = {
        number,
        openingDate,
        bankName,
        type,
        currencyCode,
        status,
      };
      accountsLinkedToBvn.push(account);
    }

    return accountsLinkedToBvn;
  }

  async getAccountsBalances(
    bvnDto: BvnDto,
    accountNumbers: AccountNumberDto[],
  ) {
    const accountsBalances = [];
    for (const { number } of accountNumbers) {
      faker.seed(Number(bvnDto.bvn) + Number(number));
      accountsBalances.push(
        dinero({
          amount: parseInt(faker.finance.amount({ min: 10000, max: 100000 })),
          currency: NGN,
        }),
      );
    }

    return accountsBalances;
  }

  async getPhoneLinkedToBvn(bvnDto: BvnDto) {
    faker.seed(Number(bvnDto.bvn));
    const phoneLinkedToBvn = `+234-${faker.phone.number()}`.replace('-', '');
    return { phone: phoneLinkedToBvn };
  }
}
