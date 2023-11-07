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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ERole } from '@src/enums/role.enum';
import { AnswersService } from './answers.service';
import {
  CreateAnswerDto,
  ResponseAnswerDto,
  ResponseAnswersDto,
  ResponseDeleteAnswerDto,
} from './dto/answers.dto';

@ApiTags('Answers')
@Controller('api/answers')
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

  // Add answer
  @ApiOperation({ summary: 'Create a new answer' })
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
  @ApiOkResponse({ description: 'OK', type: ResponseAnswerDto })
  @ApiNotFoundResponse({ description: 'Answer not found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ERole.ADMIN)
  @Post()
  public async createAnswer(@Body() body: CreateAnswerDto) {
    return await this.answersService.createAnswer(body);
  }

  // Get answer
  @ApiOperation({ summary: 'Get answers' })
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
  @ApiOkResponse({ description: 'OK', type: [ResponseAnswersDto] })
  @ApiNotFoundResponse({ description: 'Answer not found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard)
  @Get(':questionId')
  public async getAnswers(
    @Param('questionId', ParseIntPipe) questionId: number,
  ) {
    return await this.answersService.getAnswers(questionId);
  }

  // Update answer
  @ApiOperation({ summary: 'Update answer by id' })
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
  @ApiOkResponse({ description: 'OK', type: ResponseAnswerDto })
  @ApiNotFoundResponse({ description: 'Answer not found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ERole.ADMIN)
  @Patch(':answerId')
  public async updateAnswer(
    @Param('answerId', ParseIntPipe) answerId: number,
    @Body() body: CreateAnswerDto,
  ) {
    return await this.answersService.updateAnswer(answerId, body);
  }

  // Delete answer
  @ApiOperation({ summary: 'Delete answer by id' })
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
  @ApiOkResponse({ description: 'OK', type: ResponseDeleteAnswerDto })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ERole.ADMIN)
  @Delete(':answerId')
  public async deleteAnswer(@Param('answerId', ParseIntPipe) answerId: number) {
    return await this.answersService.deleteAnswer(answerId);
  }
}
