import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTestDto } from './dto/create-test.dto';
import { Test } from './tests.entity';

@Injectable()
export class TestsService {
  constructor(
    @InjectRepository(Test)
    private readonly testRepository: Repository<Test>,
  ) {}
  // Add test
  async createTest(createTestDto: CreateTestDto): Promise<Test> {
    const existingTest = await this.testRepository.findOne({
      where: {
        internshipStream: createTestDto.internshipStream,
        streamNumber: createTestDto.streamNumber,
        availabilityStartDate: createTestDto.availabilityStartDate,
        availabilityEndDate: createTestDto.availabilityEndDate,
        duration: createTestDto.duration,
      },
    });

    if (existingTest) {
      throw new ConflictException(
        'Test with similar parameters already exists',
      );
    }

    const test = this.testRepository.create(createTestDto);
    const createdTest = await this.testRepository.save(test);
    return createdTest;
  }

  // Get all tests
  async getTests(
    internshipStream?: string,
    startDate?: string,
  ): Promise<Test[]> {
    const filters: Record<string, any> = {};

    if (internshipStream !== undefined) {
      filters.internshipStream = internshipStream;
    }
    if (startDate !== undefined) {
      const formattedStartDate = new Date(startDate);
      filters.startDate = formattedStartDate.toISOString();
    }

    return this.testRepository.find({ where: filters });
  }
}
