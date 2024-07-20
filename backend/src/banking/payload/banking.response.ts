import { ResponseObject } from 'src/response/response.dto';

import { HttpStatus } from '@nestjs/common';

export const BvnIsVerified: ResponseObject = {
  status: HttpStatus.OK,
  message: 'BVN is verified',
};

export const BvnNotVerified: ResponseObject = {
  status: HttpStatus.BAD_REQUEST,
  message: 'BVN not verified',
};

export const LinkedAccountsAreRetrieved: ResponseObject = {
  status: HttpStatus.OK,
  message: 'Linked accounts are retrieved',
};

export const AccountsAreLinked: ResponseObject = {
  status: HttpStatus.OK,
  message: 'Accounts are linked',
};

export const InsufficientFunds: ResponseObject = {
  status: HttpStatus.OK,
  message: 'Insufficient funds',
};

export const NoLinkedAccounts: ResponseObject = {
  status: HttpStatus.BAD_REQUEST,
  message: 'No linked accounts',
};

export const AccountsBalancesAreRetrieved: ResponseObject = {
  status: HttpStatus.OK,
  message: 'Accounts balances are retrieved',
};

export const AccountsSummaryAreRetrieved: ResponseObject = {
  status: HttpStatus.OK,
  message: 'Accounts summary are retrieved',
};

export const AccountIsRetrieved: ResponseObject = {
  status: HttpStatus.OK,
  message: 'Account is retrieved',
};

export const TransactionsAreRetrieved: ResponseObject = {
  status: HttpStatus.OK,
  message: 'Transactions are retrieved',
};

export const AccountDetailsIsRetrieved: ResponseObject = {
  status: HttpStatus.OK,
  message: 'Account details is retrieved',
};
