import { AnswersEntity } from '@entities/answers/answers.entity';
import { AnswersService } from '@entities/answers/answers.service';
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
  ) {}

  // Create test or get test
  public async createTest(userId: number) {
    const currentDate = new Date();
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
    const testTimeOver = new Date(test.endDate);
    if (currentDate > testTimeOver) {
      throw new BadRequestException('Test time is over');
    }
    if (test) {
      return { ...test, questionBlocks: JSON.parse(test.questionBlocks) };
    }

    const endDate = new Date(currentDate);
    endDate.setDate(endDate.getDate() + 3);
    const testTime = this.formatTestTime(blockQuestions.blockCompletionTime);

    const newTest = this.testRepository.create({
      internshipStream: stream.internshipStreamName,
      direction: user.direction,
      streamNumber: stream.number,
      startDate: currentDate.toISOString(),
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
    let testQuestions: ITestQuestions[] = [];
    const user = await this.userRepository.findOne({ where: { id } });
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
    return testQuestions;
  }

  // Update test
  public async updateTest(id: number, body: UpdateTestDto) {
    const test = await this.testRepository.findOne({ where: { id } });
    if (!test) {
      throw new NotFoundException('Test not found');
    }
    const user = await this.userRepository.findOne({
      where: { id: test.owner },
    });
    const answers = await this.answersRepository.find({
      where: {
        id: In(body.answersIds),
      },
    });

    let totalCorrectAnswers = 0;

    const answersResult = answers.reduce((acc, item) => {
      if (item.isRight) {
        totalCorrectAnswers = totalCorrectAnswers + 1;
      }
      const existingItem = acc.find(
        (resultItem) => resultItem.blockName === item.blockName,
      );
      if (existingItem) {
        existingItem.totalAnswer = existingItem.totalAnswer + 1;
        if (item.isRight) {
          existingItem.correctAnswer = existingItem.correctAnswer + 1;
        }
      } else {
        acc.push({
          blockName: item.blockName,
          correctAnswer: item.isRight ? 1 : 0,
          totalAnswer: 1,
        });
      }
      return acc;
    }, []);

    if (totalCorrectAnswers >= test.correctAnswers) {
      test.isPassTest = true;
      user.isPassedTest = true;
    }

    test.testResults = JSON.stringify(answersResult);

    await this.testRepository.save(test);
    await this.userRepository.save(user);

    return {
      ...test,
      questionBlocks: JSON.parse(test.questionBlocks),
      testResults: JSON.parse(test.testResults),
    };
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
}
