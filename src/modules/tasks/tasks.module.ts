import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TasksService } from './tasks.service';

import { StreamEntity } from '@entities/streams/streams.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StreamEntity])],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
