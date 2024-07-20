import { dinero } from 'dinero.js';
import { DateTime } from 'luxon';
import * as seedrandom from 'seedrandom';
import {
  AccountDto,
  AccountNumberDto,
  BvnDto,
  TransactionDto,
  TransactionFilterDto,
  TransactionType,
  TransferAccountDto,
} from 'src/banking/payload/banking.dto';

import { NGN } from '@dinero.js/currencies';
import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { AccountStatus, AccountType } from '@prisma/client';

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
      const bankCode = faker.finance.iban();

      const account: AccountDto = {
        number,
        openingDate,
        bankName,
        type,
        currencyCode,
        bankCode,
        status,
      };
      accountsLinkedToBvn.push(account);
    }

    return accountsLinkedToBvn;
  }

  async getAccountBalance(bvnDto: BvnDto, accountNumberDto: AccountNumberDto) {
    faker.seed(Number(bvnDto.bvn) + Number(accountNumberDto.number));
    const accountBalance = dinero({
      amount: parseInt(
        faker.finance.amount({ min: minAmount, max: maxAmount }),
      ),
      currency: NGN,
    });
    return accountBalance;
  }

  async getPhoneLinkedToBvn(bvnDto: BvnDto) {
    faker.seed(Number(bvnDto.bvn));
    const phoneLinkedToBvn = `234-${faker.phone.number()}`.replace('-', '');
    return { phone: phoneLinkedToBvn };
  }

  async getTransactions(
    bvnDto: BvnDto,
    transactionFilterDto: TransactionFilterDto,
  ) {
    faker.seed(Number(bvnDto.bvn));
    seedrandom(Number(bvnDto.bvn));

    const today = DateTime.now().toISODate();
    const endDate = DateTime.fromISO(transactionFilterDto.endDate ?? today);

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
              min: transactionFilterDto.minAmount ?? minAmount,
              max: transactionFilterDto.maxAmount ?? maxAmount,
            }),
          ),
          currency: NGN,
        });
        const transactionType =
          transactionFilterDto.transactionType ??
          (faker.helpers.arrayElement(['Credit', 'Debit']) as TransactionType);
        const description = faker.finance.transactionDescription();
        const accountNumber = faker.helpers.arrayElement(
          transactionFilterDto.accountNumbers,
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
      accountNumber: accountNumberDto.number,
    };

    return accountDetails;
  }
}
