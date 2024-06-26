import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import {
  CreateQuestionDto,
  UpdateQuestionDto,
} from './dto/questions/questions.dto';

import { AnswersEntity } from '@entities/answers/answers.entity';
import { QuestionsBlockEntity } from '@entities/questions-block/questions-block.entity';
import { QuestionEntity } from '@entities/questions/questions.entity';

import { AnswersService } from '../answers/answers.service';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(QuestionEntity)
    private readonly questionRepository: Repository<QuestionEntity>,
    @InjectRepository(QuestionsBlockEntity)
    private readonly blockQuestionRepository: Repository<QuestionsBlockEntity>,
    @InjectRepository(AnswersEntity)
    private readonly answersRepository: Repository<AnswersEntity>,
    private readonly answersService: AnswersService,
  ) {}

  // Add question
  public async createQuestion(adminId: number, body: CreateQuestionDto) {
    const {
      questionText,
      code,
      blockQuestionsId,
      difficulty,
      points,
      answers,
    } = body;
    const blockQuestion = await this.blockQuestionRepository.findOne({
      where: { id: blockQuestionsId },
    });
    if (!blockQuestion) {
      throw new BadRequestException('Block questions not found');
    }

    const question = await this.questionRepository.findOne({
      where: { questionText },
    });
    if (question) {
      return true;
    }
    const newQuestion = this.questionRepository.create({
      questionText,
      code: code ? code : null,
      difficulty,
      points,
      blockQuestionsId: blockQuestion.id,
      owner: adminId,
    });

    const createdQuestion = await this.questionRepository.save(newQuestion);
    const createAnswers = await this.answersService.createAnswer(
      blockQuestion.blockName,
      createdQuestion,
      answers,
    );

    return { ...createdQuestion, answers: createAnswers };
  }

  // Update question
  public async updateQuestion(id: number, body: UpdateQuestionDto) {
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
    const question = await this.questionRepository.findOne({ where: { id } });
    if (!question) {
      throw new NotFoundException('Question not found');
    }
    const answers = await this.answersRepository.find({
      where: {
        id: In(question.answersId),
      },
    });
    await this.answersRepository.remove(answers);
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

  // Get question by id
  public async getQuestionById(id: number) {
    const question = await this.questionRepository.findOne({ where: { id } });
    const answers = await this.answersRepository.find({
      where: { owner: question.id },
    });

    return { ...question, answers };
  }
}
