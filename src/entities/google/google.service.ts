import { InternshipStreamService } from '@entities/internship-stream/internship-stream.service';
import { TokensService } from '@entities/tokens/tokens.service';
import { RoleEntity } from '@entities/users/role.entity';
import { UserEntity } from '@entities/users/users.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ERole } from '@src/enums/role.enum';
import { Repository } from 'typeorm';

@Injectable()
export class GoogleService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    private readonly tokensService: TokensService,
    private readonly streamService: InternshipStreamService,
  ) {}

  public async auth(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['roles'],
    });
    if (user) {
      return await this.tokensService.generateTokens(user);
    }

    const stream = await this.streamService.getActiveInternshipStream();
    if (!stream) {
      throw new BadRequestException('No active stream');
    }

    const currentDate = new Date();
    const registrationDate = currentDate.toLocaleString('uk-UA').split(',')[0];

    const role = this.roleRepository.create({
      role: ERole.USER,
    });

    const newUser = this.userRepository.create({
      email,
      verified: true,
      streamId: stream.id,
      registrationDate,
    });
    newUser.roles = [role];
    await this.roleRepository.save(role);
    await this.userRepository.save(newUser);

    return await this.tokensService.generateTokens(newUser);
  }
}
