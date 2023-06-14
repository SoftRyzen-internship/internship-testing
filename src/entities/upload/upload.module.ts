import { User } from '@entities/users/users.entity';
import { UserModule } from '@entities/users/users.module';
import { JwtGuardsModule } from '@guards/jwtGuard/jwt-guard.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../', 'public'),
    }),
    MulterModule.register(),
    UserModule,
    JwtGuardsModule,
    ConfigModule,
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
