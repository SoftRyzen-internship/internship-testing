import { Controller, Post, Body, UseGuards, Get, Query } from '@nestjs/common';
import { TestsService } from './tests.service';
import { CreateTestDto } from './dto/create-test.dto';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@guards/jwtGuard/jwt-auth.guard';
import { Roles } from '@guards/roleGuard/decorators/role.decorator';
import { ERole } from '@src/enums/role.enum';

@Controller('api/tests')
export class TestController {
  constructor(private readonly testService: TestsService) {}

  // Add test
  @ApiOperation({ summary: 'Create a new test' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Access token',
    required: true,
  })
  @ApiOkResponse({ description: 'OK' })
  @ApiConflictResponse({ description: 'This test has already been added' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard)
  @Roles(ERole.ADMIN)
  @Post()
  async createTest(@Body() createTestDto: CreateTestDto) {
    return this.testService.createTest(createTestDto);
  }

  // Get all tests with filtering
  @ApiOperation({ summary: 'Get all tests with filtering' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Access token',
    required: true,
  })
  @ApiOkResponse({ description: 'OK', type: CreateTestDto, isArray: true })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @ApiQuery({ name: 'internshipStream', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @UseGuards(JwtAuthGuard)
  @Roles(ERole.ADMIN)
  @Get()
  async getTests(
    @Query('internshipStream') internshipStream?: string,
    @Query('startDate') startDate?: string,
  ) {
    return this.testService.getTests(internshipStream, startDate);
  }
}
