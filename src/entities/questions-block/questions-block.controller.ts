import { JwtAuthGuard } from '@guards/jwtGuard/jwt-auth.guard';
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
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
import { QuestionBlockDto } from './dto/questions-block.dto';
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
  // ! add check admin
  @Post()
  async addBlock(@Body() body: QuestionBlockDto, @Req() req: MyRequest) {
    return await this.questionBlockService.addBlock(req.user.id, body);
  }
}
