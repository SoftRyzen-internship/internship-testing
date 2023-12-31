import { InternshipStreamEntity } from '@entities/internship-stream/internship-stream.entity';
import { TechnicalTestEntity } from '@entities/technical-test/technical-test.entity';
import { TestEntity } from '@entities/testing/tests.entity';
import { TokensService } from '@entities/tokens/tokens.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateDirectionDto } from './dto/update-direction.dto';
import { CandidateProgressUpdatesDto, UserDto } from './dto/update-user.dto';
import { IStreamInfo } from './types/interfaces';
import { UserEntity } from './users.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(TestEntity)
    private readonly testsRepository: Repository<TestEntity>,
    @InjectRepository(TechnicalTestEntity)
    private readonly technicalTestRepository: Repository<TechnicalTestEntity>,
    @InjectRepository(InternshipStreamEntity)
    private readonly streamRepository: Repository<InternshipStreamEntity>,
    private readonly tokensService: TokensService,
  ) {}

  // Current user
  public async currentUser(email: string) {
    const user: UserEntity = await this.getUser(email);
    const userWithoutPassword = this.deleteFieldsOfUser(user);
    const tokens = await this.tokensService.generateTokens(user);

    const userData: Partial<Omit<UserEntity, 'roles'>> = {
      ...userWithoutPassword,
      streamsHistory: user.streamsHistory
        ? JSON.parse(user.streamsHistory)
        : null,
    };
    const responseData = {
      refreshToken: tokens.refreshToken,
      accessToken: tokens.accessToken,
      user: userData,
    };

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
      await this.userRepository.update(user.id, {
        ...body,
        isCompleteData: true,
      });
    }
    return await this.currentUser(email);
  }

  // Update direction
  public async updateUserDirection(email: string, body: UpdateDirectionDto) {
    const user = await this.getUser(email);
    if (user.isOffer) {
      throw new BadRequestException(
        'You have already attended a training session at SoftRyzen.',
      );
    }
    const streamInfoParse: IStreamInfo[] = user.streamsHistory
      ? JSON.parse(user.streamsHistory)
      : [];
    const stream = await this.streamRepository.findOne({
      where: { id: user.streamId },
    });
    const currentStreamInfo = {
      direction: body.direction,
      streamId: stream.id,
      startDate: stream.startDate,
      internshipStreamName: stream.internshipStreamName,
    };
    const streamsInfo = [...streamInfoParse, currentStreamInfo];
    const updateUser: Partial<UserEntity> = {
      direction: body.direction,
      streamsHistory: JSON.stringify(streamsInfo),
    };
    Object.assign(user, updateUser);
    await this.userRepository.save(user);
    return await this.currentUser(user.email);
  }

  // Update stream
  public async updateUserStream(email: string, streamId: number) {
    const user = await this.getUser(email);
    if (user.streamId === streamId) {
      throw new BadRequestException(
        'The user is already registered for this stream',
      );
    }

    const updateUserStream: Partial<UserEntity> = {
      streamId,
      isPassedTest: false,
      scoreTest: 0,
      isSentTest: false,
      isStartTest: false,
      isPassedTechnicalTask: false,
      isSentTechnicalTask: false,
      isSendInterview: false,
      isFailedInterview: false,
      isSuccessInterview: false,
      startDateInterview: null,
      isOffer: false,
    };

    Object.assign(user, updateUserStream);
    await this.userRepository.save(user);
    return await this.currentUser(user.email);
  }

  // Update isSendInterview, isFailedInterview, startDateInterview, isOffer, isSuccessInterview
  public async candidateProgressUpdates(
    userId: number,
    body: CandidateProgressUpdatesDto,
  ) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    Object.assign(user, body);
    await this.userRepository.save(user);
    return await this.currentUser(user.email);
  }

  private deleteFieldsOfUser(user: UserEntity) {
    const roles: string[] = user.roles.map((role) => role.role);
    delete user.password;
    delete user.verifyToken;
    delete user.fileId;
    delete user.refreshToken;

    return { ...user, roles };
  }
}
