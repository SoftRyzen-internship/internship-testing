import { UserEntity } from '@entities/users/users.entity';
import { Injectable } from '@nestjs/common';
import {
  IStudentsByDirection,
  ResponseDashboardDto,
} from './dto/dashboard.dto';
import { ERole } from '@src/enums/role.enum';

@Injectable()
export class DashboardService {
  // Dashboard
  public async dashboard() {
    const usersRegister: UserEntity[] = await this.userRepository.find();
    const users: UserEntity[] = [...usersRegister].filter(
      (user) => user.direction !== ERole.ADMIN,
    );
    const direction = ['QA', 'PM', 'Frontend'];
    const studentsByDirection: IStudentsByDirection = this.userReduce(users);
    const countPassedTest = this.filterUsers(users, 'isPassedTest');
    const countPassedTechnicalTask = this.filterUsers(
      users,
      'isPassedTechnicalTask',
    );
    const data: ResponseDashboardDto = {
      totalNumberOfDirections: direction.length,
      theNumberOfStudentsByDirection: studentsByDirection,
      howManyCandidatesRegistered: users.length,
      howManyCandidatesPassedTheTest: countPassedTest,
      howManyCandidatesPassedTheTechnicalTask: countPassedTechnicalTask,
      howManyTechnicalTasksAreChecked: 16, // !
    };
    return { data: data };
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
