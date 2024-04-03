import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
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
  ResponseDeleteAnswerDto,
} from './dto/answers.dto';

import { JwtAuthGuard } from '@guards/jwtGuard/jwt-auth.guard';
import { Roles } from '@guards/roleGuard/decorators/role.decorator';
import { RoleGuard } from '@guards/roleGuard/role.guard';

@ApiTags('Answers')
@Controller('api/answers')
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

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
