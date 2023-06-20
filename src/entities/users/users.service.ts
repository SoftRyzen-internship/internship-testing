import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateDirectionDto } from './dto/update-direction.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './users.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  public async getUser(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException();
    }
    delete user.password;
    delete user.verifyToken;
    return user;
  }

  public async updateUser(email: string, body: UpdateUserDto) {
    const user = await this.getUser(email);
    if (user) {
      await this.userRepository.update(user.id, body);
    }
    return await this.userRepository.findOne({ where: { email } });
  }

  public async updateUserDirection(email: string, body: UpdateDirectionDto) {
    const user = await this.getUser(email);
    await this.userRepository.update(user.id, { direction: body.direction });
    return this.userRepository.findOne({ where: { id: user.id } });
  }
}
