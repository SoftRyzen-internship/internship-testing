import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ERole } from '@src/enums/role.enum';

import { MyRequest } from '@src/types/request.interface';

import {
  CreateQuestionBlockDto,
  ResponseQuestionBlockDto,
} from './dto/questions-block.dto';

import { QuestionsBlockService } from './questions-block.service';

import { JwtAuthGuard } from '@guards/jwtGuard/jwt-auth.guard';
import { Roles } from '@guards/roleGuard/decorators/role.decorator';
import { RoleGuard } from '@guards/roleGuard/role.guard';

@ApiTags('Question block')
@Controller('api/questions-block')
export class QuestionsBlockController {
  constructor(private readonly questionBlockService: QuestionsBlockService) {}

  // Add block questions
  @ApiOperation({ summary: 'Add block question' })
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
  @ApiOkResponse({ description: 'OK', type: ResponseQuestionBlockDto })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ERole.ADMIN)
  @Post()
  async addBlock(@Body() body: CreateQuestionBlockDto, @Req() req: MyRequest) {
    return await this.questionBlockService.addBlock(req.user.id, body);
  }

  // Update block questions by id
  @ApiOperation({ summary: 'Update block question' })
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
  @ApiOkResponse({ description: 'OK', type: ResponseQuestionBlockDto })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ERole.ADMIN)
  @Patch(':id')
  async updateBlock(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateQuestionBlockDto,
  ) {
    return await this.questionBlockService.updateBlock(id, body);
  }

  // Get all blocks questions
  @ApiOperation({ summary: 'Get all block question by directionName' })
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
  @ApiOkResponse({ description: 'OK', type: [ResponseQuestionBlockDto] })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard)
  @Get(':directionName')
  async getBlock(@Param('directionName') directionName: string) {
    return await this.questionBlockService.getBlock(directionName);
  }
}
