import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

import {
  CreateResultTechnicalDto,
  UpdateResultTechnicalDto,
} from './dto/result.dto';

import { StreamEntity } from '@entities/streams/streams.entity';
import { ResultTechnicalTestEntity } from '@entities/tech-test-results/tech-test-results.entity';
import { UserEntity } from '@entities/users/users.entity';

import { GoogleDriveService } from '../google-drive/google-drive.service';
import { TechnicalTestService } from '../technical-test/technical-test.service';

@Injectable()
export class TechnicalTestResultService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ResultTechnicalTestEntity)
    private readonly resultRepository: Repository<ResultTechnicalTestEntity>,
    @InjectRepository(StreamEntity)
    private readonly streamRepository: Repository<StreamEntity>,
    private readonly techTestService: TechnicalTestService,
    private readonly googleDriveService: GoogleDriveService,
  ) {}

  // Add result for a technical test
  public async addResultTechnicalTest(
    userId: number,
    body: CreateResultTechnicalDto,
  ) {
    const currentDate = new Date();
    const techTest = await this.techTestService.getTechnicalTest(userId);
    const deadline = new Date(techTest.deadline);
    if (currentDate > deadline) {
      throw new BadRequestException(
        'The technical specification task time has ended',
      );
    }
    const newTechResult = this.resultRepository.create({ ...body, userId });

    await this.resultRepository.save(newTechResult);
    await this.userRepository.update(userId, { isSentTechnicalTask: true });
    await this.updateUserDataSpreadsheet(userId, newTechResult);
    return newTechResult;
  }

  // Get all test results
  public async getAllTestResults(isChecked: boolean) {
    const filtered: FindManyOptions = {};
    if (isChecked !== undefined) {
      filtered.where = { isChecked };
    }
    return await this.resultRepository.find(filtered);
  }

  // Get technical test results by user ID
  public async getTechnicalTestResultsByUserId(userId: number) {
    return await this.resultRepository.find({
      where: {
        userId,
      },
    });
  }

  // Update technical result test
  public async updateTechnicalResultTest(
    id: number,
    body: UpdateResultTechnicalDto,
  ) {
    const testResult = await this.resultRepository.findOne({ where: { id } });
    const user = await this.userRepository.findOne({
      where: { id: testResult.userId },
    });
    user.isPassedTechnicalTask = body.isPassedUserTechTest;
    testResult.isChecked = true;
    testResult.isPassedTechnicalTask = body.isPassedUserTechTest;
    await this.resultRepository.save(testResult);
    await this.userRepository.save(user);
    return testResult;
  }

  private async updateUserDataSpreadsheet(
    userId: number,
    resultTechnicalTest: ResultTechnicalTestEntity,
  ) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const stream = await this.streamRepository.findOne({
      where: { id: user.streamId },
    });
    await this.googleDriveService.updateInfoTechnicalTestSpreadsheet(
      stream.spreadsheetId,
      resultTechnicalTest,
      user.direction,
    );
    return true;
  }
}
