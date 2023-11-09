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
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ERole } from '@src/enums/role.enum';
import { MyRequest } from '@src/types/request.interface';
import {
  CreateTechnicalTestDto,
  ResponseCreateTechnicalTestDto,
} from './dto/tech-test.dto';
import { TechnicalTestService } from './technical-test.service';

@ApiTags('Technical tests')
@Controller('api/technical-tests')
export class TechnicalTestController {
  constructor(private readonly technicalTestService: TechnicalTestService) {}

  // Add technical test
  @ApiOperation({ summary: 'Add new technical test' })
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
  @ApiBody({ type: CreateTechnicalTestDto })
  @ApiCreatedResponse({
    description: 'Created',
    type: ResponseCreateTechnicalTestDto,
  })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ERole.ADMIN)
  @Post()
  public async addTechnicalTest(@Body() body: CreateTechnicalTestDto) {
    return await this.technicalTestService.addTechnicalTest(body);
  }

  // Get technical test
  @ApiOperation({ summary: 'Get technical test by direction' })
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
  @ApiOkResponse({ description: 'OK', type: ResponseCreateTechnicalTestDto })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard)
  @Get()
  public async getTechnicalTest(@Req() req: MyRequest) {
    return await this.technicalTestService.getTechnicalTest(req.user.id);
  }

  // Update technical test
  @ApiOperation({ summary: 'Update technical test by ID' })
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
  @ApiOkResponse({ description: 'OK', type: ResponseCreateTechnicalTestDto })
  @ApiNotFoundResponse({ description: 'Technical test not found' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ERole.ADMIN)
  @Patch(':id')
  public async updateTechnicalTest(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateTechnicalTestDto,
  ) {
    return await this.technicalTestService.updateTechnicalTest(id, body);
  }
}
