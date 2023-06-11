import { User } from '@entities/users/users.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class GoogleService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  public async auth(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      return {
        id: user.id,
        username: user.firstName,
        fieldOfInternship: '',
        nameInternshipStream: '',
      };
    }
    throw new NotFoundException('Not found');
  }
}
