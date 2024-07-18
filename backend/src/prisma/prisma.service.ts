import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  async getSelectFields(selectList: string[]) {
    const selectFields: { [key: string]: boolean } = {};
    selectList.forEach((field) => {
      selectFields[field] = true;
    });

    return selectFields;
  }
}
