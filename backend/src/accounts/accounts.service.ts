import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/utils/prisma.service';
import { ResponseDto } from 'src/utils/response.dto';

@Injectable()
export class AccountsService {
  constructor(private prismaService: PrismaService) {}

  async verifyBvn(bvn: string): Promise<ResponseDto<null>> {
    return {
      statusCode: HttpStatus.OK,
      message: `Verified BVN: ${bvn}.`,
    };
  }
}
