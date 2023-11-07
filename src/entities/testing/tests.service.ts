import { AnswersEntity } from '@entities/answers/answers.entity';
import { InternshipStream } from '@entities/internship-stream/internship-stream.entity';
import { QuestionsBlockService } from '@entities/questions-block/questions-block.service';
import { UserEntity } from '@entities/users/users.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UpdateTestDto } from './dto/test.dto';
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
    @InjectRepository(AnswersEntity)
    private readonly answersRepository: Repository<AnswersEntity>,
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
      return { ...test, questionBlocks: JSON.parse(test.questionBlocks) };
    }
    const startDate = new Date(stream.startDate);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 3);
    const testTime = this.formatTestTime(blockQuestions.blockCompletionTime);

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
      testTime,
    });
    await this.testRepository.save(newTest);

    return { ...newTest, questionBlocks: blockQuestions.directions };
  }

  // Get all tests with filter
  public async getTests(userId: number, direction: string, startDate: string) {
    const filtered = {};
    if (userId) {
      filtered['owner'] = Number(userId);
    }
    if (direction) {
      filtered['direction'] = direction;
    }
    if (startDate) {
      filtered['startDate'] = new Date(startDate);
    }
    const tests = await this.testRepository.find({ where: filtered });
    const responseTest = tests.map((test) => {
      return { ...test, questionBlocks: JSON.parse(test.questionBlocks) };
    });
    return responseTest;
  }

  // Start of the test
  public async startTest(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    user.isStartTest = true;
    await this.userRepository.save(user);
    return { message: 'Test started' };
  }

  // Update test
  async updateTest(id: number, body: UpdateTestDto) {
    const test = await this.testRepository.findOne({ where: { id } });
    console.log('id :>> ', test);
    if (!test) {
      throw new NotFoundException('Test not found');
    }
    const answers = await this.answersRepository.find({
      where: {
        id: In(body.answersIds),
      },
    });
    console.log('answers :>> ', answers);
    return '';
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

  // Format time test
  private formatTestTime(minute: number) {
    const hours = Math.floor(minute / 60);
    const minutes = minute % 60;
    const seconds = 0;

    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }
}
