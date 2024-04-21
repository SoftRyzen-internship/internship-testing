import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateAnswerDto } from './dto/answers.dto';

import { AnswersEntity } from '@entities/answers/answers.entity';
import { QuestionEntity } from '@entities/questions/questions.entity';

@Injectable()
export class AnswersService {
  constructor(
    @InjectRepository(AnswersEntity)
    private readonly answersRepository: Repository<AnswersEntity>,
    @InjectRepository(QuestionEntity)
    private readonly questionRepository: Repository<QuestionEntity>,
  ) {}

  // Add answer
  public async createAnswer(
    blockName: string,
    question: QuestionEntity,
    body: CreateAnswerDto[],
  ) {
    for (const answer of body) {
      const newAnswer = this.answersRepository.create({
        ...answer,
        blockName,
        owner: question.id,
      });
      await this.answersRepository.save(newAnswer);
      question.answersId = question.answersId
        ? [...question.answersId, newAnswer.id]
        : [newAnswer.id];
      await this.questionRepository.save(question);
    }

    return await this.answersRepository.find({ where: { owner: question.id } });
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
    const answer = await this.answersRepository.findOne({ where: { id } });
    const question = await this.questionRepository.findOne({
      where: { id: answer.owner },
    });
    const index = question.answersId.indexOf(id);
    if (index !== -1) {
      question.answersId.splice(index, 1);
      await this.questionRepository.save(question);
    }
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
