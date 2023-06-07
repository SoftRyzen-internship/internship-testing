import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'
import { User } from '@entities/users/users.entity';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

    async checkEmailUnique(email: string): Promise<boolean> {
        const isUnique = await this.userRepository.findOne({ where: { email } });
        return !isUnique;
      }

}
