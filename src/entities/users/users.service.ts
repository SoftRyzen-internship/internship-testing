import { Direction } from '@entities/direction/direction.entity';
import { InternshipStream } from '@entities/internship-stream/internship-stream.entity';
import { TechnicalTest } from '@entities/technical-test/technical-test.entity';
import { Test } from '@entities/testing/tests.entity';
import { TokensService } from '@entities/tokens/tokens.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateDirectionDto } from './dto/update-direction.dto';
import { UserDto } from './dto/update-user.dto';
import { UserEntity } from './users.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(Test) private readonly testsRepository: Repository<Test>,
    @InjectRepository(TechnicalTest)
    private readonly technicalTestRepository: Repository<TechnicalTest>,
    @InjectRepository(InternshipStream)
    private readonly streamRepository: Repository<InternshipStream>,
    @InjectRepository(Direction)
    private readonly directionRepository: Repository<Direction>,
    private readonly tokensService: TokensService,
  ) {}

  // Current user
  public async currentUser(email: string) {
    const user: UserEntity = await this.getUser(email);
    const userWithoutPassword = this.deleteFieldsOfUser(user);
    const stream: InternshipStream = await this.streamRepository.findOne({
      where: { id: user.streamId },
    });
    const test: Test = await this.testsRepository.findOne({
      where: { streamNumber: stream?.id },
    });
    const techTest: TechnicalTest = await this.technicalTestRepository.findOne({
      where: { direction: user.direction },
    });
    const tokens = await this.tokensService.generateTokens(user);

    const userData = {
      ...userWithoutPassword,
      test: {
        isSent: user.isSentTest,
        isStartTest: user.isStartTest,
        isSuccess: user.isPassedTest,
        startDate: test ? test.startDate : null,
        endDate: test ? test.endDate : null,
      },
      task: {
        isSent: user.isSentTechnicalTask,
        isSuccess: user.isPassedTechnicalTask,
        deadlineDate: techTest
          ? getDateDeadline(techTest.deadline).formatDeadline
          : null,
      },
    };
    const responseData = {
      refreshToken: tokens.refreshToken,
      accessToken: tokens.accessToken,
      user: userData,
    };

    if (!user.firstName || !user.phone) {
      return responseData;
    }

    return responseData;
  }

  // Get user
  public async getUser(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['roles'],
    });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  // Update user
  public async updateUser(email: string, body: UserDto) {
    const user = await this.getUser(email);
    if (user) {
      await this.userRepository.update(user.id, body);
    }
    return await this.currentUser(email);
  }

  // Update direction
  public async updateUserDirection(
    email: string,
    { direction }: UpdateDirectionDto,
  ) {
    const user = await this.getUser(email);
    await this.userRepository.update(user.id, { direction });
    return this.userRepository.findOne({ where: { id: user.id } });
  }
}
