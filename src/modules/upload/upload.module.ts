import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MulterConfigService } from './config/multer-config';

import { UploadController } from './upload.controller';

import { UploadService } from './upload.service';

import { UserEntity } from '@entities/users/users.entity';

import { JwtGuardsModule } from '@guards/jwtGuard/jwt-guard.module';
import { ConfigModule } from '@src/config.module';
import { UserModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
    UserModule,
    JwtGuardsModule,
    ConfigModule,
  ],
  controllers: [UploadController],
  providers: [UploadService, ConfigService],
})
export class UploadModule {}
