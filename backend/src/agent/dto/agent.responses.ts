import { ResponseObject } from 'src/response/response.dto';

import { HttpStatus } from '@nestjs/common';

export const IntentIsGotten: ResponseObject = {
  status: HttpStatus.OK,
  message: 'Intent is gotten',
};
