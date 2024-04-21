import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { BaseController } from './base.controller';

import { BaseService } from './base.service';

@Module({
  controllers: [BaseController],
  providers: [BaseService, ConfigService],
})
export class BaseModule {}
