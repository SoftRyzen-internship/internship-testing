import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddMaterialsDto } from './dto/materials.dto';
import { MaterialsEntity } from './materials.entity';

@Injectable()
export class MaterialsService {
  constructor(
    @InjectRepository(MaterialsEntity)
    private readonly materialRepository: Repository<MaterialsEntity>,
  ) {}

  public async addMaterials(body: AddMaterialsDto) {
    const material = await this.materialRepository.findOne({
      where: {
        materialName: body.materialName,
      },
    });
    if (material) {
      throw new ConflictException(
        'The material with the same name is already in the database. Maybe you want to upgrade?',
      );
    }
    const newMaterials = this.materialRepository.create(body);
    await this.materialRepository.save(newMaterials);
    return newMaterials;
  }
}
