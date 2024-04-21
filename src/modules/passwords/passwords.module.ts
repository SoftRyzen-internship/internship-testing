import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '@entities/users/users.entity';

import { PasswordController } from './passwords.controller';

import { PasswordService } from './passwords.service';

import { MailModule } from '../mail/mail.module';
import { TokensModule } from '../tokens/tokens.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), MailModule, TokensModule],
  controllers: [PasswordController],
  providers: [PasswordService, JwtService, ConfigService],
})
export class PasswordModule {}
