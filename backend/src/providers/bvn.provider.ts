import * as seedrandom from 'seedrandom';

import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { ResponseDTO } from 'src/utils/response.dto';

@Injectable()
export class BVNProvider {
  async getPhoneLinkedToBVN(bvn: string) {
    faker.seed(Number(bvn));
    seedrandom(Number(bvn));

    const isValidBVN = Math.random() < 0.9;
    if (isValidBVN) {
      const phoneLinkedToBVN = `+234-${faker.phone.number()}`.replace('-', '');
      return ResponseDTO.success('BVN is valid.', phoneLinkedToBVN);
    } else return ResponseDTO.error('BVN is invalid.');
  }
}
