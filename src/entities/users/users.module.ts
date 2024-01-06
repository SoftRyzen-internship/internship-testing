import { AuthModule } from '@entities/auth/auth.module';
import { InternshipStreamEntity } from '@entities/internship-stream/internship-stream.entity';
import { TechnicalTestEntity } from '@entities/technical-test/technical-test.entity';
import { TestEntity } from '@entities/testing/tests.entity';
import { TokensModule } from '@entities/tokens/tokens.module';
import { JwtGuardsModule } from '@guards/jwtGuard/jwt-guard.module';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './users.controller';
import { UserEntity } from './users.entity';
import { UserService } from './users.service';
import { GoogleDriveModule } from '@entities/google-drive/google-drive.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      UserEntity,
      TestEntity,
      TechnicalTestEntity,
      InternshipStreamEntity,
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
