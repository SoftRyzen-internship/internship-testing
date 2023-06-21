import { User } from '@entities/users/users.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ERole } from '@src/enums/role.enum';
import { Repository } from 'typeorm';
import { Role } from '@entities/users/role.entity';
import { AuthService } from '@entities/auth/auth.service';


@Injectable()
export class GoogleService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly authService: AuthService,
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

  public async registerWithGoogle(email: string) {

    let user = await this.userRepository.findOne({where:{ email }});

    if (!user) {
      user = new User();
      user.email = email;
      user.avatar = '/avatars/avatar_pokemon.png';
       user.verified = true;
    const role = this.roleRepository.create({
      role: ERole.USER,
    });
    user.roles = [role];

      await this.userRepository.save(user);
    }
   
    const tokens = await this.authService.generateTokens(user);
  const userInfo = {
    id: user.id,
    email: user.email,
  };

  return {
    tokens,
    userInfo,
  };
  }
}
