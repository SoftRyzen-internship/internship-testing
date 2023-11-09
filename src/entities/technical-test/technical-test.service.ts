import { InternshipStreamService } from '@entities/internship-stream/internship-stream.service';
import { UserEntity } from '@entities/users/users.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTechnicalTestDto } from './dto/tech-test.dto';
import { TechnicalTest } from './technical-test.entity';

@Injectable()
export class TechnicalTestService {
  constructor(
    @InjectRepository(TechnicalTest)
    private readonly techTestRepository: Repository<TechnicalTest>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly streamService: InternshipStreamService,
  ) {}

  // Add new technical test
  async addTechnicalTest(body: CreateTechnicalTestDto) {
    const stream = await this.streamService.getActiveInternshipStream();
    if (!stream) {
      throw new BadRequestException('First, create a stream');
    }
    const deadlineDate = this.getDateDeadline(stream.startDate);

    const newTechTest = this.techTestRepository.create({
      ...body,
      internshipStreamId: stream.id,
      deadline: deadlineDate.deadline,
    });
    await this.techTestRepository.save(newTechTest);

    return { ...newTechTest, deadline: deadlineDate.formatDeadline };
  }

  // Get technical task
  async getTechnicalTest(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const stream = await this.streamService.getActiveInternshipStream();
    const techTest = await this.techTestRepository.findOne({
      where: { direction: user.direction, internshipStreamId: stream.id },
    });
    if (!techTest) {
      throw new NotFoundException('Test not found');
    }

    return techTest;
  }

  // Update an technical test
  async updateTechnicalTest(id: number, body: CreateTechnicalTestDto) {
    const techTest = await this.techTestRepository.findOne({ where: { id } });
    Object.assign(techTest, body);
    await this.techTestRepository.save(techTest);

    return techTest;
  }

  // Get date deadline
  private getDateDeadline(date: Date) {
    const deadlineDate = new Date(date);
    deadlineDate.setDate(deadlineDate.getDate() - 21);
    deadlineDate.setHours(12);
    deadlineDate.setMinutes(0);
    const day = deadlineDate.getDate();
    const month = deadlineDate.getMonth() + 1;
    const year = deadlineDate.getFullYear();
    const hours = deadlineDate.getHours();
    const minutes = deadlineDate.getMinutes();

    return {
      deadline: deadlineDate,
      formatDeadline: `${day.toString().padStart(2, '0')}.${month
        .toString()
        .padStart(2, '0')}.${year} ${hours
        .toString()
        .padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
    };
  }
}
