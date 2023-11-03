import { JwtAuthGuard } from '@guards/jwtGuard/jwt-auth.guard';
import { Roles } from '@guards/roleGuard/decorators/role.decorator';
import { RoleGuard } from '@guards/roleGuard/role.guard';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
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
import { CreateTestDto, ResponseStartTestDto } from './dto/create-test.dto';
import { TestsService } from './tests.service';

@ApiTags('Tests')
@Controller('api/tests')
export class TestController {
  constructor(private readonly testService: TestsService) {}

  // Get test
  @ApiOperation({ summary: 'Get test' })
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
  @ApiOkResponse({ description: 'OK', type: '' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @ApiQuery({ name: 'direction', required: true })
  @UseGuards(JwtAuthGuard)
  @Get()
  public async getTest(@Req() req: MyRequest) {
    return await this.testService.getTest(req.user.id);
  }

  // Add test
  @ApiOperation({ summary: 'Create a new test' })
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
  @ApiOkResponse({ description: 'OK' })
  @ApiConflictResponse({ description: 'This test has already been added' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard)
  @Post()
  async createTest(@Body() createTestDto: CreateTestDto) {
    return this.testService.createTest(createTestDto);
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
  @ApiOkResponse({ description: 'OK', type: CreateTestDto, isArray: true })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @ApiQuery({ name: 'direction', required: false })
  @ApiQuery({ name: 'availabilityStartDate', required: false })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getTests(
    @Req() req: MyRequest,
    @Query('direction') direction?: string,
    @Query('availabilityStartDate') availabilityStartDate?: string,
  ) {
    return this.testService.getTests(
      req.user.id,
      direction,
      availabilityStartDate,
    );
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
  @ApiOkResponse({ description: 'OK', type: ResponseStartTestDto })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard)
  @Get('start-test')
  async startTest(@Req() req: MyRequest) {
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
  @ApiOkResponse({ description: 'OK' })
  @ApiNotFoundResponse({ description: 'Test not found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ERole.ADMIN)
  @Patch(':id')
  async updateTest(
    @Param('id') id: number,
    @Body() createTestDto: CreateTestDto,
  ) {
    return this.testService.updateTest(id, createTestDto);
  }
}