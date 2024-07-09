import * as seedrandom from 'seedrandom';

import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { ResponseDTO } from 'src/utils/response.dto';

@Injectable()
export class BvnProvider {
  async getPhoneLinkedToBvn(bvn: string) {
    faker.seed(Number(bvn));
    seedrandom(Number(bvn));

    const isValidBvn = Math.random() < 0.9;
    if (isValidBvn) {
      const phoneLinkedToBvn = `+234-${faker.phone.number()}`.replace('-', '');
      return ResponseDTO.success('Bvn is valid.', phoneLinkedToBvn);
    } else return ResponseDTO.error('Bvn is invalid.');
  }
}
