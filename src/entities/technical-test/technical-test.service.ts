import { InternshipStreamService } from '@entities/internship-stream/internship-stream.service';
import { UserEntity } from '@entities/users/users.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getDateDeadline } from '@utils/format-deadline-tech-test';
import { Repository } from 'typeorm';
import { CreateTechnicalTestDto } from './dto/tech-test.dto';
import { TechnicalTestEntity } from './technical-test.entity';

@Injectable()
export class TechnicalTestService {
  constructor(
    @InjectRepository(TechnicalTestEntity)
    private readonly techTestRepository: Repository<TechnicalTestEntity>,
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
    const deadlineDate = getDateDeadline(stream.startDate);

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
}
