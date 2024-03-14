import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailController } from './mail.controller';

import { MailService } from './mail.service';

import { TokensModule } from '../tokens/tokens.module';

import { UserEntity } from '@entities/users/users.entity';
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), TokensModule],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
