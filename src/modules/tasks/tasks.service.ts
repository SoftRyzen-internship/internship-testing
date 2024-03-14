import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { StreamEntity } from '@entities/streams/streams.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(StreamEntity)
    private readonly internshipStreamRepository: Repository<StreamEntity>,
  ) {}

  // Create task to changed status stream
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  public async changeActiveStream() {
    const currentDate = new Date();
    const stream = await this.internshipStreamRepository.findOne({
      where: { isActive: true },
    });
    if (currentDate > stream.endDateTechnicalTest) {
      stream.isOpenRegister = false;
      await this.internshipStreamRepository.save(stream);
    }
  }
}
