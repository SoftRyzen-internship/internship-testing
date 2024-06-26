import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, In, Repository } from 'typeorm';

import { CreateStreamDto } from './dto/create-stream.dto';

import { DirectionEntity } from '@entities/directions/directions.entity';
import { StreamEntity } from '@entities/streams/streams.entity';
import { TestEntity } from '@entities/testing/testing.entity';
import { UserEntity } from '@entities/users/users.entity';

import { SHEET_DEFAULT_NAME } from '@src/constants/constants';

import { GoogleDriveService } from '../google-drive/google-drive.service';

@Injectable()
export class StreamService {
  constructor(
    @InjectRepository(StreamEntity)
    private readonly internshipStreamRepository: Repository<StreamEntity>,
    @InjectRepository(DirectionEntity)
    private readonly directionRepository: Repository<DirectionEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(TestEntity)
    private readonly testingRepository: Repository<TestEntity>,
    private readonly googleDriveService: GoogleDriveService,
  ) {}

  // Create new stream
  public async createInternshipStream(adminId: number, body: CreateStreamDto) {
    const lastActiveStream = await this.internshipStreamRepository.findOne({
      where: { isActive: true },
    });
    if (lastActiveStream) {
      lastActiveStream.isActive = false;
      await this.internshipStreamRepository.save(lastActiveStream);
    }

    const newStream = this.internshipStreamRepository.create({
      ...body,
      owner: 'admin',
      ownerId: adminId,
      number: lastActiveStream ? lastActiveStream.number + 1 : 1,
    });

    const titles = (
      await this.getDirectionForStream(newStream.directionsIds)
    ).map((direction) => direction.direction);

    newStream.spreadsheetId = await this.createSpreadsheetInFolder(
      newStream.internshipStreamName,
      [SHEET_DEFAULT_NAME, ...titles],
    );

    const createdStream = await this.internshipStreamRepository.save(newStream);
    return createdStream;
  }

  // Get active stream
  public async getActiveInternshipStream(userId?: number) {
    const stream = await this.internshipStreamRepository.findOne({
      where: { isActive: true },
    });
    const directions: DirectionEntity[] = await this.getDirectionForStream(
      stream.directionsIds,
    );

    const streamInfo = await this.getInternshipStreamById(stream.id, userId);

    return { ...streamInfo, directions };
  }

  // Get streams with sorting and filtering
  public async getInternshipStreams(
    number: number,
    internshipStreamName: string,
    direction: string,
    startDate: string,
  ) {
    const filter: FindManyOptions = {
      order: { number: 'DESC' },
    };
    if (number !== undefined) {
      filter.where = { ...filter.where, number: Number(number) };
    }
    if (internshipStreamName !== undefined) {
      filter.where = { ...filter.where, internshipStreamName };
    }
    if (startDate !== undefined) {
      filter.where = { ...filter.where, startDate };
    }

    return await this.internshipStreamRepository.find(filter);
  }

  // Get stream by id
  public async getInternshipStreamById(streamId: number, userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const stream = await this.internshipStreamRepository.findOne({
      where: { id: streamId },
    });
    const test = await this.testingRepository.findOne({
      where: { streamId, userId: userId },
    });
    return {
      ...stream,
      isCompleteData: user.isCompleteData,
      test: {
        isSent: user.isSentTest,
        isStartTest: user.isStartTest,
        isSuccess: user.isPassedTest,
        startDate: test ? test.startDate : stream.startDateTesting,
        endDate: test ? test.endDate : stream.endDateTesting,
        testResult: test ? JSON.parse(test.testResults) : [],
        duration: test ? test.testTime : null,
        numberOfQuestions: test ? test.numberOfQuestions : null,
        correctAnswers: test ? test.correctAnswers : null,
      },
      task: {
        isSent: user.isSentTechnicalTask,
        isSuccess: user.isPassedTechnicalTask,
        deadlineDate: stream.endDateTechnicalTest,
      },
      interview: {
        isSend: user.isSendInterview,
        isFailed: user.isFailedInterview,
        isSuccess: user.isSuccessInterview,
        startDate: user.startDateInterview,
        meetingInterviewUrl: user.meetingInterviewUrl,
        startDateOnlineInterview: stream.startDateOnlineInterview,
        endDateOnlineInterview: stream.endDateOnlineInterview,
      },
      offer: {
        isOffer:
          user.isPassedTechnicalTask && !user.isFailedInterview && user.isOffer,
      },
    };
  }

  // update stream
  public async updateInternshipStreamFields(id: number, body: CreateStreamDto) {
    const stream = await this.internshipStreamRepository.findOne({
      where: { id },
    });
    if (!stream) {
      throw new NotFoundException('Internship stream not found');
    }

    Object.assign(stream, body);

    return await this.internshipStreamRepository.save(stream);
  }

  // Get direction for stream
  private async getDirectionForStream(directionIds: number[]) {
    if (directionIds.length === 0) {
      return [];
    }

    return await this.directionRepository.find({
      where: {
        id: In(directionIds),
      },
    });
  }

  private async createSpreadsheetInFolder(
    spreadsheetName: string,
    titles: string[],
  ) {
    const spreadsheetId =
      await this.googleDriveService.createSpreadsheetInFolder(
        spreadsheetName,
        titles,
      );

    return spreadsheetId;
  }
}
