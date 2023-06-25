import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-quest.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from './question.entity';
import { Repository, DeleteResult, Equal } from 'typeorm';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  // Add question
  async createQuestion(createQuestionDto: CreateQuestionDto) {
    const question = this.questionRepository.create(createQuestionDto);

    const createdQuestion = await this.questionRepository.save(question);

    return {
      success: true,
      message: 'Question add successfully',
      data: createdQuestion,
    };
  }

  // Update question
  async updateQuestion(
    id: number,
    updateQuestionDto: Partial<CreateQuestionDto>,
  ) {
    const question = await this.questionRepository.findOne({ where: { id } });
    if (!question) {
      throw new NotFoundException('Question not found');
    }

    Object.assign(question, updateQuestionDto);

    await this.questionRepository.save(question);
    return question;
  }

  // Delete question
  async deleteQuestion(id: number): Promise<DeleteResult> {
    const result = await this.questionRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Question not found');
    }

    return result;
  }

  // Get questions by block questions
  async getQuestionsByBlock(blockId: number): Promise<Question[]> {
    const questions = await this.questionRepository.find({
      where: { blockId: Equal(blockId) },
    });

    if (!questions) {
      throw new NotFoundException('Block not found');
    }
    return questions;
  }
}
