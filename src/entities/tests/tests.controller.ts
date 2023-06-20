
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { TestsService } from './tests.service';
import { CreateTestDto } from './dto/create-test.dto';
import { ApiBearerAuth, ApiConflictResponse, ApiForbiddenResponse, ApiHeader, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '@guards/jwtGuard/jwt-auth.guard';

@Controller('api/tests')
export class TestController {
  constructor(private readonly testService: TestsService) {}

    // Add test
    @ApiOperation({ summary: 'Create a new test' })
  @ApiBearerAuth()
    @ApiHeader({
        name: 'Authorization',
        description: 'Access token',
        required:true,
    })
    @ApiOkResponse({ description: 'OK' })
        @ApiConflictResponse({ description: 'This test has already been added' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard)
//   @Roles(ERole.ADMIN)
  @Post()
  async createTest(@Body() createTestDto: CreateTestDto) {
    return this.testService.createTest(createTestDto);
  }
}
