import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import { Repository } from 'typeorm';
import * as XLSX from 'xlsx';

import { EPointsDifficulty } from '@src/enums/difficulty.enum';

import { ParseXlsxDto } from './dto/parse-xlsx.dto';

import { QuestionsService } from '../questions/questions.service';

import { QuestionsBlockEntity } from '@entities/questions-block/questions-block.entity';

@Injectable()
export class ParseXlsxService {
  constructor(
    @InjectRepository(QuestionsBlockEntity)
    private readonly questionBlockRepository: Repository<QuestionsBlockEntity>,
    private readonly questionService: QuestionsService,
  ) {}

  // Upload file
  public async uploadFileXlsx(
    file: Express.Multer.File,
    body: ParseXlsxDto,
    adminId: number,
  ) {
    const jsonData = await this.convertXlsxToJSON(file, body.sheetName);
    let blockName: string;
    if (body.sheetName === 'HTMLCSS') {
      blockName = 'HTML/CSS';
    } else {
      blockName = body.sheetName;
    }

    const questionBlock = await this.questionBlockRepository.findOne({
      where: { blockName },
    });
    if (!questionBlock) {
      throw new NotFoundException('Block questions not found');
    }

    const questions = jsonData.map((question) => {
      const answers = [];
      let answerIndex = 1;
      while (question[`Answer ${answerIndex}`]) {
        const answerValue = question[`Answer ${answerIndex}`];
        answers.push({
          answer: String(answerValue).replace(/^"|"$/g, ''),
          isRight: question['Correct answer'] === answerIndex,
        });
        answerIndex = answerIndex + 1;
      }
      return {
        questionText: question['Questions'],
        code: question['Code'] ? question['Code'] : null,
        answers,
        difficulty: question['Difficulty'].toLowerCase(),
        points: Number(EPointsDifficulty[question['Difficulty'].toUpperCase()]),
        blockQuestionsId: questionBlock.id,
      };
    });

    for (const question of questions) {
      await this.questionService.createQuestion(adminId, question);
    }
    fs.unlinkSync(file.path);
    return { message: 'Access' };
  }

  // Convert XLSX to JSON
  private async convertXlsxToJSON(
    file: Express.Multer.File,
    sheetName: string,
  ) {
    try {
      const workbook = XLSX.readFile(file.path);
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      return jsonData;
    } catch (error) {
      fs.unlinkSync(file.path);
      throw new BadRequestException('Error reading file .xlsx');
    }
  }
}
