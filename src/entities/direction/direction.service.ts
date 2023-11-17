import { InternshipStreamEntity } from '@entities/internship-stream/internship-stream.entity';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ERole } from '@src/enums/role.enum';
import { In, Repository } from 'typeorm';
import { DirectionEntity } from './direction.entity';
import { AddDirectionDto } from './dto/direction.dto';

@Injectable()
export class DirectionService {
  constructor(
    @InjectRepository(DirectionEntity)
    private readonly directionRepository: Repository<DirectionEntity>,
    @InjectRepository(InternshipStreamEntity)
    private readonly streamRepository: Repository<InternshipStreamEntity>,
  ) {}

  public async addDirection(id: number, body: AddDirectionDto) {
    const candidate = await this.getDirection('direction', body.direction);
    if (candidate) {
      throw new ConflictException('This direction has already been added');
    }
    const newDirection = this.directionRepository.create({
      ...body,
      ownerId: id,
      owner: ERole.ADMIN,
    });
    await this.directionRepository.save(newDirection);
    return newDirection;
  }

  public async geAllDirection() {
    const stream = await this.streamRepository.findOne({
      where: { isActive: true },
    });
    if (!stream) {
      throw new NotFoundException('Internship stream not found');
    }
    return this.directionRepository.find({
      where: {
        id: In(stream.directionsIds),
      },
    });
  }

  public async updateDirection(id: number, body: AddDirectionDto) {
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
