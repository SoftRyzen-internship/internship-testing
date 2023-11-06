import { InternshipStream } from '@entities/internship-stream/internship-stream.entity';
import { QuestionsBlockService } from '@entities/questions-block/questions-block.service';
import { UserEntity } from '@entities/users/users.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTestDto } from './dto/create-test.dto';
import { Test } from './tests.entity';
import { IDirectionsForTests } from './types/interfaces';

@Injectable()
export class TestsService {
  constructor(
    @InjectRepository(Test)
    private readonly testRepository: Repository<Test>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(InternshipStream)
    private readonly streamRepository: Repository<InternshipStream>,
    private readonly questionBlockService: QuestionsBlockService,
  ) {}

  // Create test
  public async createTest(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const stream = await this.streamRepository.findOne({
      where: { id: user.streamId },
    });
    if (!stream) {
      throw new NotFoundException('Stream not found');
    }
    const blockQuestions = await this.getBlockQuestions(user.direction);

    const test = await this.testRepository.findOne({
      where: {
        owner: user.id,
        internshipStream: stream.internshipStreamName,
      },
    });
    if (test) {
      return test;
    }
    const startDate = new Date(stream.startDate);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 3);

    const newTest = this.testRepository.create({
      internshipStream: stream.internshipStreamName,
      direction: user.direction,
      streamNumber: stream.number,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      owner: user.id,
      questionBlocks: JSON.stringify(blockQuestions.directions),
      numberOfQuestions: blockQuestions.numberOfQuestions,
      correctAnswers: blockQuestions.numberOfCorrectAnswers,
      // testTime
    });

    return newTest;
  }

  // Get blok questions
  private async getBlockQuestions(directionName: string) {
    let blockCompletionTime = 0;
    let numberOfQuestions = 0;
    let numberOfCorrectAnswers = 0;
    const directions: IDirectionsForTests[] = [];

    const blockQuestions = await this.questionBlockService.getBlock(
      directionName,
    );

    for (const block of blockQuestions) {
      blockCompletionTime = blockCompletionTime + block.blockCompletionTime;
      numberOfQuestions = numberOfQuestions + block.numberOfQuestions;
      numberOfCorrectAnswers =
        numberOfCorrectAnswers + block.numberOfCorrectAnswers;
      directions.push({
        blockName: block.blockName,
        numberOfQuestions: block.numberOfQuestions,
        numberOfCorrectAnswers: block.numberOfCorrectAnswers,
      });
    }

    return {
      directions,
      blockCompletionTime,
      numberOfQuestions,
      numberOfCorrectAnswers,
    };
  }

  // Add test
  // async createTest(createTestDto: CreateTestDto) {
  //   // const existingTest = await this.testRepository.findOne({
  //   //   where: {
  //   //     internshipStream: createTestDto.internshipStream,
  //   //     streamNumber: createTestDto.streamNumber,
  //   //     startDate: createTestDto.availabilityStartDate,
  //   //     endDate: createTestDto.availabilityEndDate,
  //   //     testTime: createTestDto.duration,
  //   //   },
  //   // });
  //   // if (existingTest) {
  //   //   throw new ConflictException(
  //   //     'Test with similar parameters already exists',
  //   //   );
  //   // }
  //   // const test = this.testRepository.create(createTestDto);
  //   // const createdTest = await this.testRepository.save(test);
  //   // return createdTest;
  // }

  // Get all tests with filter
  public async getTests(
    userId: number,
    direction?: string,
    availabilityStartDate?: string,
  ) {
    // const user = await this.userRepository.findOne({ where: { id: userId } });
    // if (user && user.isSentTest) {
    //   throw new ForbiddenException('You do not have access to this test');
    // }
    const filters: Record<string, any> = {};

    if (direction !== undefined) {
      filters.direction = direction;
    }
    if (availabilityStartDate !== undefined) {
      const formattedStartDate = new Date(availabilityStartDate);
      filters.availabilityStartDate = formattedStartDate.toISOString();
    }
    const tests = await this.testRepository.find({ where: filters });
    if (tests.length === 0) {
      throw new NotFoundException('No tests found for the selected criteria');
    }

    // await this.userRepository.update(userId, { isSentTest: true });
    return tests;
  }

  // Start of the test
  public async startTest(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    user.isStartTest = true;
    await this.userRepository.save(user);
    return { message: 'Test started' };
  }

  // Update test
  async updateTest(id: number, fieldsToUpdate: Partial<CreateTestDto>) {
    const test = await this.testRepository.findOne({ where: { id } });
    if (!test) {
      throw new NotFoundException('Test not found');
    }

    Object.assign(test, fieldsToUpdate);
    return this.testRepository.save(test);
  }
}
