import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-quest.dto'; 
import { ApiBearerAuth, ApiConflictResponse, ApiForbiddenResponse, ApiHeader, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@guards/jwtGuard/jwt-auth.guard';

@ApiTags('Questions')
@Controller('api/questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

    // Add question
  @ApiOperation({ summary: 'Create a new question' })
  @ApiBearerAuth()
    @ApiHeader({
        name: 'Authorization',
        description: 'Access token',
        required:true,
    })
    @ApiOkResponse({ description: 'OK' })
        @ApiConflictResponse({ description: 'This direction has already been added' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard)
//   @Roles(ERole.ADMIN)
    @Post()
  async createQuestion(@Body() createQuestionDto: CreateQuestionDto) {
      const createdQuestion = await this.questionsService.createQuestion(createQuestionDto);
      return createdQuestion;
  }

    // Update question
    @ApiOperation({ summary: 'Update question' })
  @ApiBearerAuth()
    @ApiHeader({
        name: 'Authorization',
        description: 'Access token',
        required:true,
    })
    @ApiOkResponse({ description: 'OK' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard)
//   @Roles(ERole.ADMIN)
  @Patch(':id')
  async updateQuestion(@Param('id') id: number, @Body() updateQuestionDto: Partial<CreateQuestionDto>) {
        const updatedQuestion = await this.questionsService.updateQuestion(id, updateQuestionDto);
        return updatedQuestion
    }
    
     @ApiOperation({ summary: 'Delete question' })
  @ApiBearerAuth()
    @ApiHeader({
        name: 'Authorization',
        description: 'Access token',
        required:true,
    })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard)
//   @Roles(ERole.ADMIN)
    @Delete(':id')
async deleteQuestion(@Param('id') id: number) {
  return this.questionsService.deleteQuestion(id);
}

}
