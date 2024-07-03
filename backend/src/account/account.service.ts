import { HttpStatus, Injectable } from '@nestjs/common';
import { OBPService } from 'src/providers/obp.service';

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
