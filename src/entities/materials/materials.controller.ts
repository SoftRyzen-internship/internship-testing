import { JwtAuthGuard } from '@guards/jwtGuard/jwt-auth.guard';
import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { MaterialsDto, ResponseMaterialsDto } from './dto/materials.dto';
import { MaterialsService } from './materials.service';

@ApiTags('Materials')
@Controller('api/materials')
export class MaterialsController {
  constructor(private readonly materialService: MaterialsService) {}

  @ApiOperation({ summary: 'Add materials' })
  @ApiOkResponse({ description: 'OK', type: ResponseMaterialsDto })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiConflictResponse({
    description:
      'The material with the same name is already in the database. Maybe you want to upgrade?',
  })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard)
  // ! @Role(ERole.ADMIN)
  @Post()
  async addMaterials(@Body() body: MaterialsDto) {
    return await this.materialService.addMaterials(body);
  }

  @ApiOperation({ summary: 'Add materials' })
  @ApiOkResponse({ description: 'OK', type: ResponseMaterialsDto })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard)
  // ! @Role(ERole.ADMIN)
  @Put(':id')
  async updateMaterials(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: MaterialsDto,
  ) {
    return await this.materialService.updateMaterials(id, body);
  }
}
