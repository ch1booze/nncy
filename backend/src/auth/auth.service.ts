import { DatabaseService } from 'src/database/database.service';

import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private databaseService: DatabaseService) {}
}
