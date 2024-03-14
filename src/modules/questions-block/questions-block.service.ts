import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateQuestionBlockDto } from './dto/questions-block.dto';

import { QuestionsBlockEntity } from '@entities/questions-block/questions-block.entity';

@Injectable()
export class QuestionsBlockService {
  constructor(
    @InjectRepository(QuestionsBlockEntity)
    private readonly questionBlockRepository: Repository<QuestionsBlockEntity>,
  ) {}

  // Add block questions
  public async addBlock(id: number, body: CreateQuestionBlockDto) {
    const newBlock = this.questionBlockRepository.create({
      ...body,
      ownerId: id,
      owner: 'admin',
    });

    await this.questionBlockRepository.save(newBlock);
    return newBlock;
  }

  // Update block questions by id
  public async updateBlock(id: number, body: CreateQuestionBlockDto) {
    const block = await this.questionBlockRepository.findOne({ where: { id } });
    if (block) {
      this.questionBlockRepository.merge(block, body);
      const updateBlock = await this.questionBlockRepository.save(block);
      return updateBlock;
    }
    return null;
  }

  // Get all blocks questions
  public async getBlock(directionName: string) {
    const blockQuestions = await this.questionBlockRepository.find();
    if (blockQuestions.length === 0) {
      throw new NotFoundException('Block questions not found');
    }
    const filteredBlockQuestions = blockQuestions.filter((block) =>
      block.directionName.includes(directionName),
    );
    return filteredBlockQuestions;
  }
}
