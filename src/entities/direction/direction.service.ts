import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Direction } from './direction.entity';
import { UpdateDirection } from './dto/update-direction.dto';
import { ERole } from '@src/enums/role.enum';

@Injectable()
export class DirectionService {
  constructor(
    @InjectRepository(Direction)
    private readonly directionRepository: Repository<Direction>,
  ) {}

  public async addDirection(id: number, direction: string) {
    const candidate = await this.getDirection('direction', direction);
    if (candidate) {
      throw new ConflictException('This direction has already been added');
    }
    const newDirection = this.directionRepository.create({
      direction,
      ownerId: id,
      owner: ERole.ADMIN,
    });
    await this.directionRepository.save(newDirection);
    return newDirection;
  }

  public async geAllDirection() {
    return this.directionRepository.find();
  }

  public async updateDirection(id: number, body: UpdateDirection) {
    const update = await this.directionRepository.update(id, body);
    if (update.affected === 0) {
      throw new BadRequestException();
    }
    return this.directionRepository.findOne({ where: { id } });
  }

  private async getDirection(field: string, value: string | number) {
    return await this.directionRepository.findOne({
      where: { [field]: value },
    });
  }
}
