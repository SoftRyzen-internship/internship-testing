import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TokensController } from './tokens.controller';

import { TokensService } from './tokens.service';

import { UserEntity } from '@entities/users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [TokensController],
  providers: [TokensService, JwtService, ConfigService],
  exports: [TokensService],
})
export class TokensModule {}
