import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './users.controller';

import { UserService } from './users.service';

import { StreamEntity } from '@entities/streams/streams.entity';
import { TechnicalTestEntity } from '@entities/tech-tests/tech-test.entity';
import { TestEntity } from '@entities/testing/testing.entity';
import { UserEntity } from '@entities/users/users.entity';

import { JwtGuardsModule } from '@guards/jwtGuard/jwt-guard.module';
import { AuthModule } from '../auth/auth.module';
import { GoogleDriveModule } from '../google-drive/google-drive.module';
import { TokensModule } from '../tokens/tokens.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      UserEntity,
      TestEntity,
      TechnicalTestEntity,
      StreamEntity,
    ]),
    JwtGuardsModule,
    TokensModule,
    GoogleDriveModule,
  ],
  controllers: [UserController],
  providers: [UserService, ConfigService],
  exports: [UserService],
})
export class UserModule {}
