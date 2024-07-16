import { Module } from '@nestjs/common';

import { ObpService } from './obp.service';

@Module({ providers: [ObpService], exports: [ObpService] })
export class ObpModule {}
