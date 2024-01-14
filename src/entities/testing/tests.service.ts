import { AnswersEntity } from '@entities/answers/answers.entity';
import { AnswersService } from '@entities/answers/answers.service';
import { GoogleDriveService } from '@entities/google-drive/google-drive.service';
import { InternshipStreamEntity } from '@entities/internship-stream/internship-stream.entity';
import { QuestionsBlockService } from '@entities/questions-block/questions-block.service';
import { QuestionsService } from '@entities/questions/questions.service';
import { UserEntity } from '@entities/users/users.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UpdateTestDto } from './dto/test.dto';
import { TestEntity } from './tests.entity';
import { IDirectionsForTests, ITestQuestions } from './types/interfaces';

@Injectable()
export class TestsService {
  constructor(
    @InjectRepository(TestEntity)
    private readonly testRepository: Repository<TestEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(InternshipStreamEntity)
    private readonly streamRepository: Repository<InternshipStreamEntity>,
    @InjectRepository(AnswersEntity)
    private readonly answersRepository: Repository<AnswersEntity>,
    private readonly questionBlockService: QuestionsBlockService,
    private readonly answersService: AnswersService,
    private readonly questionsService: QuestionsService,
    private readonly googleDriveService: GoogleDriveService,
  ) {}

  // Create test or get test
  public async createOrGetTest(userId: number) {
    const currentDate = new Date();
    const { user, stream, test } = await this.getUserAndStreamAndTest(userId);

    const blockQuestions = await this.getBlockQuestions(user.direction);
    const testTimeOver = new Date(stream.endDateTesting);
    if (currentDate > testTimeOver) {
      throw new BadRequestException('Test time is over');
    }
    if (test && user.isSentTest) {
      return { ...test, questionBlocks: JSON.parse(test.questionBlocks) };
    }

    const testTime = this.formatTestTime(blockQuestions.blockCompletionTime);

    const newTest = this.testRepository.create({
      internshipStream: stream.internshipStreamName,
      streamId: stream.id,
      direction: user.direction,
      streamNumber: stream.number,
      startDate: stream.startDateTesting,
      endDate: stream.endDateTesting,
      userId: user.id,
      questionBlocks: JSON.stringify(blockQuestions.directions),
      numberOfQuestions: blockQuestions.numberOfQuestions,
      correctAnswers: blockQuestions.numberOfCorrectAnswers,
      testTime,
    });
    await this.testRepository.save(newTest);
    user.isSentTest = true;
    await this.userRepository.save(user);

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
  public async startTest(userId: number) {
    let testQuestions: ITestQuestions[] = [];
    const { user, test } = await this.getUserAndStreamAndTest(userId);
    const questionBlocks = await this.questionBlockService.getBlock(
      user.direction,
    );

    for (const block of questionBlocks) {
      const questions = await this.getQuestionsWithAnswers(block.blockName);
      testQuestions.push(...questions);
    }
    user.isStartTest = true;
    await this.userRepository.save(user);

    testQuestions = testQuestions.sort(() => Math.random() - 0.5);
    return { testId: test.id, testQuestions };
  }

  // Update test
  public async updateTest(id: number, body: UpdateTestDto) {
    const test = await this.testRepository.findOne({ where: { id } });
    if (!test) {
      throw new NotFoundException('Test not found');
    }
    const user = await this.userRepository.findOne({
      where: { id: test.userId },
    });
    const answers = await this.answersRepository.find({
      where: {
        id: In(body.answersIds),
      },
    });

    let numberOfCorrectAnswers = 0;

    const answersResult = answers.reduce((acc, item) => {
      if (item.isRight) {
        numberOfCorrectAnswers = numberOfCorrectAnswers + 1;
      }
      const existingItem = acc.find(
        (resultItem) => resultItem.blockName === item.blockName,
      );
      if (existingItem) {
        existingItem.numberOfQuestions = existingItem.numberOfQuestions + 1;
        if (item.isRight) {
          existingItem.numberOfCorrectAnswers =
            existingItem.numberOfCorrectAnswers + 1;
        }
      } else {
        acc.push({
          blockName: item.blockName,
          numberOfCorrectAnswers: item.isRight ? 1 : 0,
          numberOfQuestions: 1,
        });
      }
      return acc;
    }, []);

    if (numberOfCorrectAnswers >= test.correctAnswers) {
      test.isPassTest = true;
      user.isPassedTest = true;
    }

    test.correctAnswers = numberOfCorrectAnswers;
    test.testResults = JSON.stringify(answersResult);
    await this.updateUserDataSpreadsheet(user.id, test);
    await this.testRepository.save(test);
    await this.userRepository.save(user);

    return {
      ...test,
      questionBlocks: JSON.parse(test.questionBlocks),
      testResults: JSON.parse(test.testResults),
    };
  }

  // Get user, stream, test
  private async getUserAndStreamAndTest(userId: number) {
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

    const test = await this.testRepository.findOne({
      where: {
        userId: user.id,
        internshipStream: stream.internshipStreamName,
      },
    });

    return { user, stream, test };
  }

  // Get array questions with answers
  private async getQuestionsWithAnswers(blockName: string) {
    const testQuestions: ITestQuestions[] = [];
    const questions = await this.questionsService.getQuestionsByBlock(
      blockName,
    );

    for (const question of questions) {
      const answers = await this.answersService.getAnswers(question.id);
      testQuestions.push({
        question: question.questionText,
        code: question.code,
        answers,
      });
    }

    return testQuestions;
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

  private async updateUserDataSpreadsheet(userId: number, test: TestEntity) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const stream = await this.streamRepository.findOne({
      where: { id: user.streamId },
    });
    await this.googleDriveService.updateInfoTestingSpreadsheet(
      stream.spreadsheetId,
      test,
      user.direction,
    );
    return true;
  }
}
