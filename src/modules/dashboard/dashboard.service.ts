import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  IStudentsByDirection,
  ResponseDashboardDto,
} from './dto/dashboard.dto';

import { ERole } from '@src/enums/role.enum';

import { StreamEntity } from '@entities/streams/streams.entity';
import { ResultTechnicalTestEntity } from '@entities/tech-test-results/tech-test-results.entity';
import { UserEntity } from '@entities/users/users.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(StreamEntity)
    private readonly internshipStreamRepository: Repository<StreamEntity>,
    @InjectRepository(ResultTechnicalTestEntity)
    private readonly techTestsRepository: Repository<ResultTechnicalTestEntity>,
  ) {}

  // Dashboard
  public async dashboard() {
    const stream = await this.internshipStreamRepository.findOne({
      where: { isActive: true },
    });
    if (!stream) {
      throw new BadRequestException('First, create a stream');
    }
    const usersRegister: UserEntity[] = await this.userRepository.find({
      where: { streamId: stream.id },
    });
    const users: UserEntity[] = [...usersRegister].filter(
      (user) => user.direction !== ERole.ADMIN,
    );
    const techCheckedTest = await this.techTestsRepository.find({
      where: { isChecked: false },
    });
    const studentsByDirection: IStudentsByDirection = this.userReduce(users);
    const countPassedTest = this.filterUsers(users, 'isPassedTest');
    const countPassedTechnicalTask = this.filterUsers(
      users,
      'isPassedTechnicalTask',
    );
    const data: ResponseDashboardDto = {
      totalNumberOfDirections: stream.directionsIds.length,
      theNumberOfStudentsByDirection: studentsByDirection,
      howManyCandidatesRegistered: users.length,
      howManyCandidatesPassedTheTest: countPassedTest,
      howManyCandidatesPassedTheTechnicalTask: countPassedTechnicalTask,
      howManyTechnicalTasksAreChecked: techCheckedTest.length,
    };
    return data;
  }

  // Filter users
  private filterUsers(users: UserEntity[], field: string) {
    const countUsers = users.filter((user) => user[field] === true);
    return countUsers.length;
  }

  // User reduce
  private userReduce(users: UserEntity[]) {
    const studentsByDirection: IStudentsByDirection = users?.reduce(
      (acc, { direction }) => {
        if (acc.hasOwnProperty(direction)) {
          acc[direction] = acc[direction] + 1;
        } else {
          acc[direction] = 1;
        }
        return acc;
      },
      {},
    );
    return studentsByDirection;
  }
}
