import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RoleEntity } from '@entities/roles/role.entity';
import { UserEntity } from '@entities/users/users.entity';

import { ERole } from '@src/enums/role.enum';

import { GoogleDriveService } from '../google-drive/google-drive.service';
import { StreamService } from '../stream/stream.service';
import { TokensService } from '../tokens/tokens.service';

@Injectable()
export class GoogleService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    private readonly tokensService: TokensService,
    private readonly streamService: StreamService,
    private readonly googleDriveService: GoogleDriveService,
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

    await this.googleDriveService.addInfoUserToAllAndDirectionSheets(
      stream.spreadsheetId,
      newUser,
    );

    return await this.tokensService.generateTokens(newUser);
  }
}
