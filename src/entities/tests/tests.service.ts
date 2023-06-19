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
      throw new ConflictException('Test with similar parameters already exists');
    }

    const test = this.testRepository.create(createTestDto);
    const createdTest = await this.testRepository.save(test);
    return createdTest;
  }
}
