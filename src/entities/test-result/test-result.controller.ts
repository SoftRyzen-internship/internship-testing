// src/entity/test-result/test-result.controller.ts
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { TestsResult } from './test-result.entity';
import { TestsResultService } from './test-result.service';
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
import { JwtAuthGuard } from '@guards/jwtGuard/jwt-auth.guard';
import { Roles } from '@guards/roleGuard/decorators/role.decorator';
import { ERole } from '@src/enums/role.enum';
import { RoleGuard } from '@guards/roleGuard/role.guard';

@ApiTags('Tests result')
@Controller('api/test-results')
export class TestResultController {
  constructor(private readonly testsResultService: TestsResultService) {}

  // Get all results
  @ApiOperation({ summary: 'Add internship stream' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Access token',
    required: true,
  })
  @ApiOkResponse({ description: 'OK' })
  @ApiConflictResponse({ description: 'This direction has already been added' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @ApiQuery({ name: 'direction', required: false })
  @ApiQuery({ name: 'number', required: false })
  @ApiQuery({ name: 'isPassedTest', required: false, type: Boolean })
  @ApiQuery({ name: 'score', required: false, type: Boolean })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ERole.ADMIN)
  @Get()
  async getAll(
    @Query('direction') direction: string,
    @Query('stream') number: string,
    @Query('passed') isPassedTest: boolean,
    @Query('sortByScore') score: boolean,
  ): Promise<TestsResult[]> {
    return this.testsResultService.getAll(
      direction,
      number,
      isPassedTest,
      score,
    );
  }
}
