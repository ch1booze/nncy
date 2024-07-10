import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { BvnDto } from 'src/account/dto';

export interface PhoneDto {
  phone: string;
}

@Injectable()
export class BvnProvider {
  async getPhoneLinkedToBvn(bvnDto: BvnDto) {
    faker.seed(Number(bvnDto.bvn));

    const phoneLinkedToBvn = `+234-${faker.phone.number()}`.replace('-', '');
    return { phone: phoneLinkedToBvn };
  }
}
