import { QuestionsBlockEntity } from '@entities/questions-block/questions-block.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuestionDto } from './dto/create-quest.dto';
import { Question } from './question.entity';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(QuestionsBlockEntity)
    private readonly blockQuestionRepository: Repository<QuestionsBlockEntity>,
  ) {}

  // Add question
  public async createQuestion(adminId: number, body: CreateQuestionDto) {
    const blockQuestion = await this.blockQuestionRepository.findOne({
      where: { blockName: body.blockQuestions },
    });
    if (!blockQuestion) {
      throw new BadRequestException(
        `Invalid block name ${body.blockQuestions}`,
      );
    }
    const question = this.questionRepository.create({
      ...body,
      blockQuestionsId: blockQuestion.id,
      owner: adminId,
    });

    const createdQuestion = await this.questionRepository.save(question);

    return {
      question: {
        ...createdQuestion,
      },
    };
  }

  // Update question
  public async updateQuestion(id: number, body: CreateQuestionDto) {
    const question = await this.questionRepository.findOne({ where: { id } });
    if (!question) {
      throw new NotFoundException('Question not found');
    }

    Object.assign(question, body);

    await this.questionRepository.save(question);
    return question;
  }

  // Delete question
  public async deleteQuestion(id: number) {
    await this.questionRepository.delete(id);

    return { message: 'Question deleted' };
  }

  // Get questions by block-questions
  public async getQuestionsByBlock(blockName: string) {
    const blockQuestion = await this.blockQuestionRepository.findOne({
      where: { blockName },
    });
    if (!blockQuestion) {
      throw new BadRequestException(`Invalid block name ${blockName}`);
    }
    const questions = await this.questionRepository
      .createQueryBuilder('questions')
      .where({
        blockQuestionsId: blockQuestion.id,
      })
      .orderBy('RANDOM()')
      .limit(blockQuestion.numberOfQuestions)
      .getMany();

    return questions;
  }
}
