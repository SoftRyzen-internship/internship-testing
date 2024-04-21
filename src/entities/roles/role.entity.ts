import { MyBaseEntity } from '@entities/base.entity';
import { UserEntity } from '@entities/users/users.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ERole } from '@src/enums/role.enum';
import { Column, Entity, ManyToMany } from 'typeorm';

@Entity('roles')
export class RoleEntity extends MyBaseEntity {
  @ApiProperty({ example: '[user]', description: 'User`s roles' })
  @Column({ name: 'user_role', type: 'enum', enum: ERole })
  role: ERole;

  @ManyToMany(() => UserEntity, (user) => user.roles)
  users: UserEntity[];
}
