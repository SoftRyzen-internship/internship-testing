import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionsBlockEntity } from './questions-block.entity';
import { QuestionBlockDto } from './dto/questions-block.dto';

@Injectable()
export class QuestionsBlockService {
  constructor(
    @InjectRepository(QuestionsBlockEntity)
    private readonly questionBlockRepository: Repository<QuestionsBlockEntity>,
  ) {}

  public async addBlock(id: number, body: QuestionBlockDto) {
    const newBlock = this.questionBlockRepository.create({
      ...body,
      ownerId: id,
      owner: 'admin',
    });

    await this.questionBlockRepository.save(newBlock);
    return newBlock;
  }
}
