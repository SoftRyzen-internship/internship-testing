import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '@entities/users/users.entity';

@Module({
  imports: [ TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService, ],
  exports: [AuthService],
})
export class AuthModule {}
