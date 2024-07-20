import { ResponseObject } from 'src/response/response.dto';

import { HttpStatus } from '@nestjs/common';

export const BudgetIsCreated: ResponseObject = {
  status: HttpStatus.OK,
  message: 'Budget is created',
};
