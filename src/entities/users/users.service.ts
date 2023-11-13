import { AuthService } from '@entities/auth/auth.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateDirectionDto } from './dto/update-direction.dto';
import { UserDto } from './dto/update-user.dto';
import { UserEntity } from './users.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly authService: AuthService,
  ) {}

  // Current user
  public async currentUser(email: string) {
    return await this.authService.responseData(email);
  }

  // Get user
  public async getUser(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  // Update user
  public async updateUser(email: string, body: UserDto) {
    const user = await this.getUser(email);
    if (user) {
      await this.userRepository.update(user.id, body);
    }
    return await this.authService.responseData(email);
  }
  // Update direction
  public async updateUserDirection(
    email: string,
    { direction }: UpdateDirectionDto,
  ) {
    const user = await this.getUser(email);
    await this.userRepository.update(user.id, { direction });
    return this.userRepository.findOne({ where: { id: user.id } });
  }
}
