import { JwtAuthGuard } from '@guards/jwtGuard/jwt-auth.guard';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
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
import { MyRequest } from '@src/types/request.interface';
import {
  QuestionBlockDto,
  RequestQuestionBlockDto,
} from './dto/questions-block.dto';
import { QuestionsBlockService } from './questions-block.service';

@ApiTags('Question block')
@Controller('api/questions-block')
export class QuestionsBlockController {
  constructor(private readonly questionBlockService: QuestionsBlockService) {}

  @ApiOperation({ summary: 'Add block question' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Access token',
    required: true,
  })
  @ApiOkResponse({ description: 'OK' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard)
  // ! @Role(ERole.ADMIN)
  @Post()
  async addBlock(@Body() body: QuestionBlockDto, @Req() req: MyRequest) {
    return await this.questionBlockService.addBlock(req.user.id, body);
  }

  @ApiOperation({ summary: 'Update block question' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Access token',
    required: true,
  })
  @ApiOkResponse({ description: 'OK' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard)
  // ! @Role(ERole.ADMIN)
  @Put(':id')
  async updateBlock(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: QuestionBlockDto,
  ) {
    return await this.questionBlockService.updateBlock(id, body);
  }

  @ApiOperation({ summary: 'Get block question' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Access token',
    required: true,
  })
  @ApiOkResponse({ description: 'OK', type: [RequestQuestionBlockDto] })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getBlock(@Query('directionName') directionName: string) {
    return await this.questionBlockService.getBlock(directionName);
  }
}
