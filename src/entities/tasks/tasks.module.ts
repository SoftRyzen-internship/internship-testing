import { InternshipStreamEntity } from '@entities/internship-stream/internship-stream.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';

@Module({
  imports: [TypeOrmModule.forFeature([InternshipStreamEntity])],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
