import { UserEntity } from '@entities/users/users.entity';
import { UserModule } from '@entities/users/users.module';
import { JwtGuardsModule } from '@guards/jwtGuard/jwt-guard.module';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@src/config.module';
import { MulterConfigService } from './config/multer-config';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

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
