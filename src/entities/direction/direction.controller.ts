import { JwtAuthGuard } from '@guards/jwtGuard/jwt-auth.guard';
import { Roles } from '@guards/roleGuard/decorators/role.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ERole } from '@src/enums/role.enum';
import { MyRequest } from '@src/types/request.interface';
import { DirectionService } from './direction.service';
import { AddDirection } from './dto/add-direction.dto';
import { UpdateDirection } from './dto/update-direction.dto';

@ApiTags('Internship direction')
@Controller('api/direction')
export class DirectionController {
  constructor(private readonly directionService: DirectionService) {}

  // Add direction
  @ApiOperation({ summary: 'Add direction' })
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
  @Roles(ERole.ADMIN)
  @Post()
  async addDirection(@Body() body: AddDirection, @Req() req: MyRequest) {
    return this.directionService.addDirection(req.user.id, body.direction);
  }

  // Get all direction
  @ApiOperation({ summary: 'Get all direction' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Access token',
    required: true,
  })
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiUnauthorizedResponse({ description: 'Not authorized' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllDirection() {
    return this.directionService.geAllDirection();
  }

  // Update direction by id
  @ApiOperation({ summary: 'Update direction' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Access token',
    required: true,
  })
  @ApiOkResponse({ description: 'OK' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard)
  @Roles(ERole.ADMIN)
  @Put(':id')
  async updateDirection(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateDirection,
  ) {
    return await this.directionService.updateDirection(id, body);
  }

  // Update direction by id
  @ApiOperation({ summary: 'Delete direction by id' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Access token',
    required: true,
  })
  @ApiOkResponse({ description: 'OK' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard)
  @Roles(ERole.ADMIN)
  @Delete(':id')
  async deleteDirection(@Param('id', ParseIntPipe) id: number) {
    return { message: `Direction with ${id}, removed ` };
  }
}
