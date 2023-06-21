import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Query,
  Param,
  Patch,
} from '@nestjs/common';
import { InternshipStreamService } from './internship-stream.service';
import { InternshipStream } from './internship-stream.entity';
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
import { JwtAuthGuard } from '@guards/jwtGuard/jwt-auth.guard';
import { CreateStreamDto } from './dto/create-stream.dto';
import { UpdateStreamDto } from './dto/update-stream.dto';

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
    description: 'Access token',
    required: true,
  })
  @ApiOkResponse({ description: 'OK' })
  @ApiConflictResponse({ description: 'This direction has already been added' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard)
  //   @Roles(ERole.ADMIN)
  @Post()
  async createInternshipStream(
    @Body() previousStream: CreateStreamDto,
  ): Promise<InternshipStream> {
    const createdStream =
      await this.internshipStreamService.createInternshipStream(previousStream);
    return createdStream;
  }

  // Get streams with sorting and filtering
  @ApiOperation({
    summary: 'Get internship streams with sorting and filtering',
  })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Access token',
    required: true,
  })
  @ApiOkResponse({ description: 'OK', type: InternshipStream, isArray: true })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @ApiQuery({ name: 'number', required: false })
  @ApiQuery({ name: 'isActive', required: false })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getInternshipStreams(
    @Query('number') number?: number,
    @Query('isActive') isActive?: boolean,
    @Query('streamDirection') streamDirection?: string,
    @Query('startDate') startDate?: string,
  ): Promise<InternshipStream[]> {
    return this.internshipStreamService.getInternshipStreams(
      number,
      isActive,
      streamDirection,
      startDate,
    );
  }

  @ApiOperation({ summary: 'Update internship stream' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Access token',
    required: true,
  })
  @ApiOkResponse({ description: 'OK' })
  @ApiNotFoundResponse({ description: 'Internship stream not found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard)
  //   @Roles(ERole.ADMIN)
  @Patch(':id')
  async updateInternshipStream(
    @Param('id') id: number,
    @Body() updateStreamDto: UpdateStreamDto,
  ): Promise<InternshipStream> {
    return this.internshipStreamService.updateInternshipStreamFields(
      id,
      updateStreamDto,
    );
  }

  // Get all active streams
  @ApiOperation({ summary: 'Get all active internship streams' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Access token',
    required: true,
  })
  @ApiOkResponse({ description: 'OK', type: InternshipStream, isArray: true })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard)
  @Get('active')
  async getActiveInternshipStreams(): Promise<InternshipStream[]> {
    return this.internshipStreamService.getActiveInternshipStreams();
  }
}
