import { OBPService } from 'src/providers/obp.service';

import { HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class AccountService {
  constructor(private obpService: OBPService) {}

  async getAccountsLinkedToUser(bvn: string) {
    const accountsLinkedToUserResponse =
      await this.obpService.getAccountsLinkedToUser(bvn);

    accountsLinkedToUserResponse.statusCode = HttpStatus.OK;
    return accountsLinkedToUserResponse;
  }
}
