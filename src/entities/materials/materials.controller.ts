import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AddMaterialsDto, ResponseMaterialsDto } from './dto/materials.dto';
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
  @Post()
  async addMaterials(@Body() body: AddMaterialsDto) {
    return await this.materialService.addMaterials(body);
  }
}
