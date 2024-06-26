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

import { CreateStreamDto } from './dto/create-stream.dto';
import { ResponseActiveStreamDto, ResponseStreamDto } from './dto/response.dto';

import { StreamService } from './stream.service';

import { JwtAuthGuard } from '@guards/jwtGuard/jwt-auth.guard';
import { Roles } from '@guards/roleGuard/decorators/role.decorator';
import { RoleGuard } from '@guards/roleGuard/role.guard';

@ApiTags('Internship stream')
@Controller('api/internship-streams')
export class StreamController {
  constructor(
    private readonly internshipStreamService: StreamService,
  ) {}

  // Add stream
  @ApiOperation({ summary: 'Add internship stream' })
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
  @ApiOkResponse({ type: ResponseStreamDto })
  @ApiConflictResponse({ description: 'This direction has already been added' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ERole.ADMIN)
  @Post()
  public async createInternshipStream(
    @Body() body: CreateStreamDto,
    @Req() req: MyRequest,
  ) {
    return await this.internshipStreamService.createInternshipStream(
      req.user.id,
      body,
    );
  }

  // Get active stream
  @ApiOperation({ summary: 'Get active internship stream' })
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
  @ApiOkResponse({ description: 'OK', type: ResponseActiveStreamDto })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard)
  @Get('active')
  public async getActiveInternshipStream(@Req() req: MyRequest) {
    return await this.internshipStreamService.getActiveInternshipStream(
      req.user.id,
    );
  }

  // Get stream by id
  @ApiOperation({
    summary: 'Get stream by id',
  })
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
  @ApiOkResponse({
    description: 'OK',
    type: ResponseStreamDto,
  })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard)
  @Get(':streamId')
  public async getInternshipStreamById(
    @Param('streamId', ParseIntPipe) streamId: number,
    @Req() req: MyRequest,
  ) {
    return await this.internshipStreamService.getInternshipStreamById(
      streamId,
      req.user.id,
    );
  }

  // Get streams with sorting and filtering
  @ApiOperation({
    summary: 'Get internship streams with sorting and filtering',
  })
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
  @ApiOkResponse({
    description: 'OK',
    type: [ResponseStreamDto],
  })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @ApiQuery({ name: 'number', required: false })
  @ApiQuery({ name: 'internshipStreamName', required: false })
  @ApiQuery({ name: 'direction', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ERole.ADMIN)
  @Get('all')
  public async getInternshipStreams(
    @Query('number') number?: number,
    @Query('internshipStreamName') internshipStreamName?: string,
    @Query('direction') direction?: string,
    @Query('startDate') startDate?: string,
  ) {
    return await this.internshipStreamService.getInternshipStreams(
      number,
      internshipStreamName,
      direction,
      startDate,
    );
  }

  // Update stream
  @ApiOperation({ summary: 'Update internship stream' })
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
  @ApiNotFoundResponse({ description: 'Internship stream not found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ERole.ADMIN)
  @Patch(':id')
  public async updateInternshipStream(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStreamDto: CreateStreamDto,
  ) {
    return await this.internshipStreamService.updateInternshipStreamFields(
      id,
      updateStreamDto,
    );
  }
}
