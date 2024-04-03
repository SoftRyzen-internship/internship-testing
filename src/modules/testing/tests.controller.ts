import {
  Body,
  Controller,
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
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { ERole } from '@src/enums/role.enum';

import { MyRequest } from '@src/types/request.interface';

import {
  ResponseStartTestDto,
  ResponseTestDto,
  ResponseUpdateTestDto,
  UpdateTestDto,
} from './dto/test.dto';

import { TestsService } from './tests.service';

import { Roles } from '@guards/roleGuard/decorators/role.decorator';

import { JwtAuthGuard } from '@guards/jwtGuard/jwt-auth.guard';
import { RoleGuard } from '@guards/roleGuard/role.guard';

@ApiTags('Testing')
@Controller('api/tests')
export class TestController {
  constructor(private readonly testService: TestsService) {}

  // Create test or get test
  @ApiOperation({ summary: 'Create test or get test' })
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
  @ApiOkResponse({ description: 'OK', type: ResponseTestDto })
  @ApiBadRequestResponse({ description: 'Test time is over' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard)
  @Post()
  public async createTest(@Req() req: MyRequest) {
    return await this.testService.createOrGetTest(req.user.id);
  }

  // Get test with filtering
  @ApiOperation({ summary: 'Get all tests with filtering' })
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
  @ApiQuery({ name: 'direction', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'userId', required: false })
  @ApiOkResponse({ description: 'OK', type: [ResponseTestDto] })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ERole.ADMIN)
  @Get('all')
  public async getTests(
    @Query('direction') direction: string,
    @Query('startDate') startDate: string,
    @Query('userId') userId: number,
  ) {
    return this.testService.getTests(userId, direction, startDate);
  }

  // Start of the test
  @ApiOperation({ summary: 'Start of the test' })
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
  @ApiOkResponse({ description: 'OK', type: [ResponseStartTestDto] })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard)
  @Get('start-test')
  public async startTest(@Req() req: MyRequest) {
    return this.testService.startTest(req.user.id);
  }

  // Update test
  @ApiOperation({ summary: 'Update test' })
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
  @ApiOkResponse({ description: 'OK', type: ResponseUpdateTestDto })
  @ApiNotFoundResponse({ description: 'Test not found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  public async updateTest(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateTestDto,
  ) {
    return this.testService.updateTest(id, body);
  }
}
