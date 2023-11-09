import { JwtAuthGuard } from '@guards/jwtGuard/jwt-auth.guard';
import { Roles } from '@guards/roleGuard/decorators/role.decorator';
import { RoleGuard } from '@guards/roleGuard/role.guard';
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
  CreateResultTechnicalDto,
  ResponseCreateResultTechnicalDto,
  ResponseUpdateResultTechnicalDto,
} from './dto/result.dto';
import { TechnicalTestResultService } from './technical-test-result.service';

@ApiTags('Technical tests result')
@Controller('api/technical-test-results')
export class TechnicalTestResultController {
  constructor(
    private readonly technicalTestResultService: TechnicalTestResultService,
  ) {}

  // Add technical test result
  @ApiOperation({ summary: 'Add technical test result' })
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
  @ApiOkResponse({ description: 'OK', type: ResponseCreateResultTechnicalDto })
  @ApiBadRequestResponse({
    description: 'The technical specification task time has ended',
  })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard)
  @Post()
  public async addResultTechnicalTest(
    @Body() body: CreateResultTechnicalDto,
    @Req() req: MyRequest,
  ) {
    return this.technicalTestResultService.addResultTechnicalTest(
      req.user.id,
      body,
    );
  }

  // Get all technical tests result
  @ApiOperation({ summary: 'Get all technical tests' })
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
  @ApiQuery({
    name: 'isChecked',
    required: false,
  })
  @ApiOkResponse({
    description: 'OK',
    type: [ResponseCreateResultTechnicalDto],
  })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ERole.ADMIN)
  @Get()
  public async getAllTestResults(@Query('isChecked') isChecked: boolean) {
    return this.technicalTestResultService.getAllTestResults(isChecked);
  }

  // Get technical test results by user ID
  @ApiOperation({ summary: 'Get technical test results by user id' })
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
  @ApiOkResponse({ description: 'OK', type: ResponseCreateResultTechnicalDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  public async getTechnicalTestResultsByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.technicalTestResultService.getTechnicalTestResultsByUserId(
      userId,
    );
  }

  // Update technical result test
  @ApiOperation({ summary: 'Update technical result test' })
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
  @ApiOkResponse({ description: 'OK', type: ResponseUpdateResultTechnicalDto })
  @ApiNotFoundResponse({ description: 'Technical test not found' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ERole.ADMIN)
  @Patch(':resultId')
  public async updateTechnicalResultTest(
    @Param('resultId', ParseIntPipe) resultId: number,
  ) {
    return await this.technicalTestResultService.updateTechnicalResultTest(
      resultId,
    );
  }
}
