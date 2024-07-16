import { dinero } from 'dinero.js';
import { DateTime } from 'luxon';
import * as seedrandom from 'seedrandom';
import {
  AccountDto,
  AccountNumberDto,
  BvnDto,
  TransactionDto,
  TransactionFilterParams,
  TransferAccountDto,
} from 'src/banking/dto';

import { NGN } from '@dinero.js/currencies';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { AccountStatus, AccountType, TransactionType } from '@prisma/client';

const accountTypes: AccountType[] = ['Current', 'Fixed', 'Savings'];
const bankNames = ['Access Bank', 'First Bank', 'Kuda Bank', 'OPay'];
const currencyCode = NGN.code;
const numberOfAccounts = 3;
const numberOfTransactionsPerDay = 3;
const minAmount = 1000;
const maxAmount = 10000;

@Injectable()
export class ObpService {
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
          amount: parseInt(
            faker.finance.amount({ min: minAmount, max: maxAmount }),
          ),
          currency: NGN,
        }),
      );
    }

    return accountsBalances;
  }

  async getPhoneLinkedToBvn(bvnDto: BvnDto) {
    faker.seed(Number(bvnDto.bvn));
    const phoneLinkedToBvn = `234-${faker.phone.number()}`.replace('-', '');
    return { phone: phoneLinkedToBvn };
  }

  async getTransactions(
    bvnDto: BvnDto,
    transactionsFilterParams: TransactionFilterParams,
  ) {
    faker.seed(Number(bvnDto.bvn));
    seedrandom(Number(bvnDto.bvn));

    const today = DateTime.now().toISODate();
    const endDate = DateTime.fromISO(transactionsFilterParams.endDate ?? today);

    const transactions: TransactionDto[] = [];
    const days = 10;
    for (let day = 0; day < days; day++) {
      const numberOfTransactions =
        Math.floor(Math.random() * numberOfTransactionsPerDay) + 1;
      for (let i = 0; i < numberOfTransactions; i++) {
        const transactionId = faker.string.uuid();
        const timestamp = endDate.minus({ hours: i, minutes: i }).toISO();
        const amount = dinero({
          amount: parseInt(
            faker.finance.amount({
              min: transactionsFilterParams.minAmount ?? minAmount,
              max: transactionsFilterParams.maxAmount ?? maxAmount,
            }),
          ),
          currency: NGN,
        });
        const transactionType: TransactionType =
          transactionsFilterParams.transactionType ??
          faker.helpers.arrayElement(['Credit', 'Debit']);
        const description = faker.finance.transactionDescription();
        const accountNumber = faker.helpers.arrayElement(
          transactionsFilterParams.accountNumbers,
        );
        const balanceAfter = dinero({
          amount: parseInt(faker.finance.amount()),
          currency: NGN,
        });

        const transaction: TransactionDto = {
          transactionId,
          timestamp,
          amount,
          transactionType,
          description,
          accountNumber,
          balanceAfter,
        };
        transactions.push(transaction);
      }
    }

    return transactions;
  }

  async getAccountDetails(accountNumberDto: AccountNumberDto) {
    faker.seed(Number(accountNumberDto.number));
    const accountName = faker.person.fullName();
    const bankCode = faker.finance.iban();

    const accountDetails: TransferAccountDto = {
      accountName,
      bankCode,
      accountNumber: accountNumberDto,
    };

    return accountDetails;
  }
}
