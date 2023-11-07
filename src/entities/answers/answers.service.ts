import { QuestionsBlockEntity } from '@entities/questions-block/questions-block.entity';
import { Question } from '@entities/questions/question.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnswersEntity } from './answers.entity';
import { CreateAnswerDto } from './dto/answers.dto';

@Injectable()
export class AnswersService {
  constructor(
    @InjectRepository(AnswersEntity)
    private readonly answersRepository: Repository<AnswersEntity>,
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    @InjectRepository(QuestionsBlockEntity)
    private readonly questionBlockRepository: Repository<QuestionsBlockEntity>,
  ) {}

  // Add answer
  public async createAnswer(body: CreateAnswerDto) {
    const question = await this.getQuestion(body.questionId);
    const questionBlock = await this.questionBlockRepository.findOne({
      where: { id: question.blockQuestionsId },
    });
    const newAnswer = this.answersRepository.create({
      ...body,
      blockName: questionBlock.blockName,
      owner: question.id,
    });
    await this.answersRepository.save(newAnswer);
    if (!question.answersId) {
      question.answersId = [newAnswer.id];
    } else {
      question.answersId = [...question.answersId, newAnswer.id];
    }
    await this.questionRepository.save(question);
    return newAnswer;
  }

  // Get answers
  public async getAnswers(questionId: number) {
    const question = await this.getQuestion(questionId);
    const answers = await this.answersRepository
      .createQueryBuilder('answer')
      .where({ owner: question.id })
      .select(['answer.answer', 'answer.id'])
      .orderBy('RANDOM()')
      .getMany();

    return answers;
  }

  // Update answer
  public async updateAnswer(id: number, body: CreateAnswerDto) {
    const answer = await this.answersRepository.findOne({ where: { id } });
    if (!answer) {
      throw new NotFoundException('Answer not found');
    }
    Object.assign(answer, body);
    await this.answersRepository.save(answer);
    return answer;
  }

  // Delete answer
  public async deleteAnswer(id: number) {
    await this.answersRepository.delete(id);
    return { message: 'Answer deleted' };
  }

  // Get question
  private async getQuestion(id: number) {
    const question = await this.questionRepository.findOne({
      where: { id },
    });
    if (!question) {
      throw new NotFoundException('Question not found');
    }
    return question;
  }
}
