import { JwtAuthGuard } from '@guards/jwtGuard/jwt-auth.guard';
import { Roles } from '@guards/roleGuard/decorators/role.decorator';
import { RoleGuard } from '@guards/roleGuard/role.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ERole } from '@src/enums/role.enum';
import { MyRequest } from '@src/types/request.interface';
import {
  CreateQuestionDto,
  ResponseCreateQuestionDto,
  ResponseDeleteQuestionsDto,
  ResponseGetQuestionDto,
  UpdateQuestionDto,
} from './dto/quest.dto';
import { QuestionsService } from './questions.service';

@ApiTags('Questions')
@Controller('api/questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  // Add question
  @ApiOperation({ summary: 'Create a new question' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Access token with type',
    required: true,
    schema: {
      type: 'string',
      format: 'Bearer YOUR_TOKEN_HERE, token-type=access_token',
    },
  })
  @ApiOkResponse({ description: 'OK', type: ResponseCreateQuestionDto })
  @ApiConflictResponse({ description: 'This direction has already been added' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ERole.ADMIN)
  @Post()
  async createQuestion(
    @Req() req: MyRequest,
    @Body() createQuestionDto: CreateQuestionDto,
  ) {
    const createdQuestion = await this.questionsService.createQuestion(
      req.user.id,
      createQuestionDto,
    );
    return createdQuestion;
  }

  // Update question
  @ApiOperation({ summary: 'Update question' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Access token with type',
    required: true,
    schema: {
      type: 'string',
      format: 'Bearer YOUR_TOKEN_HERE, token-type=access_token',
    },
  })
  @ApiOkResponse({ description: 'OK', type: ResponseCreateQuestionDto })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ERole.ADMIN)
  @Patch(':id')
  async updateQuestion(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    const updatedQuestion = await this.questionsService.updateQuestion(
      id,
      updateQuestionDto,
    );
    return updatedQuestion;
  }

  // Delete question
  @ApiOperation({ summary: 'Delete question' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Access token with type',
    required: true,
    schema: {
      type: 'string',
      format: 'Bearer YOUR_TOKEN_HERE, token-type=access_token',
    },
  })
  @ApiOkResponse({
    description: 'Ok',
    type: ResponseDeleteQuestionsDto,
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ERole.ADMIN)
  @Delete(':id')
  async deleteQuestion(@Param('id', ParseIntPipe) id: number) {
    return this.questionsService.deleteQuestion(id);
  }

  // Get question by block questions
  @ApiOperation({ summary: 'Get questions by block' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Access token with type',
    required: true,
    schema: {
      type: 'string',
      format: 'Bearer YOUR_TOKEN_HERE, token-type=access_token',
    },
  })
  @ApiQuery({ name: 'blockName' })
  @ApiOkResponse({ description: 'OK', type: [ResponseCreateQuestionDto] })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getQuestionsByBlock(@Query('blockName') blockName: string) {
    return this.questionsService.getQuestionsByBlock(blockName);
  }

  // Get question by id
  @ApiOperation({ summary: 'Get questions by id' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Access token with type',
    required: true,
    schema: {
      type: 'string',
      format: 'Bearer YOUR_TOKEN_HERE, token-type=access_token',
    },
  })
  @ApiOkResponse({ description: 'OK', type: ResponseGetQuestionDto })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard)
  @Get(':questionId')
  async getQuestionById(@Param('questionId') questionId: number) {
    return this.questionsService.getQuestionById(questionId);
  }
}
