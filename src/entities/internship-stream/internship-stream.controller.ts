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
import { ResponseStreamDto } from './dto/response.dto';
import { InternshipStreamService } from './internship-stream.service';

@ApiTags('Internship stream')
@Controller('api/internship-streams')
export class InternshipStreamController {
  constructor(
    private readonly internshipStreamService: InternshipStreamService,
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
    const createdStream =
      await this.internshipStreamService.createInternshipStream(
        req.user.id,
        body,
      );
    return createdStream;
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
  @ApiOkResponse({ description: 'OK', type: ResponseStreamDto })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard)
  @Get('active')
  public async getActiveInternshipStream() {
    return await this.internshipStreamService.getActiveInternshipStream();
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
    isArray: true,
  })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @ApiQuery({ name: 'number', required: false })
  @ApiQuery({ name: 'isActive', required: false })
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
