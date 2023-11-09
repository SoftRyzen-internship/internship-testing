import { TechnicalTestService } from '@entities/technical-test/technical-test.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateResultTechnicalDto } from './dto/result.dto';
import { ResultTechnicalTest } from './result-test.entity';

@Injectable()
export class TechnicalTestResultService {
  constructor(
    @InjectRepository(ResultTechnicalTest)
    private readonly resultRepository: Repository<ResultTechnicalTest>,
    private readonly techTestService: TechnicalTestService,
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
    return newTechResult;
  }

  // Get all test results
  public async getAllTestResults(isChecked: boolean) {
    if (isChecked === undefined) {
      return await this.resultRepository.find();
    } else {
      return await this.resultRepository.find({ where: { isChecked } });
    }
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
  public async updateTechnicalResultTest(id: number) {
    const testResult = await this.resultRepository.findOne({ where: { id } });
    testResult.isChecked = true;
    await this.resultRepository.save(testResult);
    return testResult;
  }
}