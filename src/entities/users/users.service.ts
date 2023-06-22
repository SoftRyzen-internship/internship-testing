import { AuthService } from '@entities/auth/auth.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ERole } from '@src/enums/role.enum';
import { Repository } from 'typeorm';
import {
  IStudentsByDirection,
  ResponseDashboardDto,
} from './dto/response-dashboard.dto';
import { UpdateDirectionDto } from './dto/update-direction.dto';
import { UserDto } from './dto/update-user.dto';
import { User } from './users.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
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
  public async updateUserDirection(email: string, body: UpdateDirectionDto) {
    const user = await this.getUser(email);
    await this.userRepository.update(user.id, { direction: body.direction });
    return this.userRepository.findOne({ where: { id: user.id } });
  }

  // Dashboard
  public async dashboard() {
    const usersRegister: User[] = await this.userRepository.find();
    const users: User[] = [...usersRegister].filter(
      (user) => user.direction !== ERole.ADMIN,
    );
    const direction = ['QA', 'PM', 'Full stack'];
    const studentsByDirection: IStudentsByDirection = this.userReduce(users);
    const countPassedTest = this.filterUsers(users, 'isPassedTest');
    const countPassedTechnicalTask = this.filterUsers(
      users,
      'isPassedTechnicalTask',
    );

    const data: ResponseDashboardDto = {
      total_number_of_directions: direction.length,
      the_number_of_students_by_direction: studentsByDirection,
      how_many_candidates_registered: users.length,
      how_many_candidates_passed_the_test: countPassedTest,
      how_many_candidates_passed_the_technical_task: countPassedTechnicalTask,
      how_many_technical_tasks_are_checked: 16, // !
    };

    return { data: data };
  }

  // Filter users
  private filterUsers(users: User[], field: string) {
    const countUsers = users.filter((user) => user[field] === true);
    return countUsers.length;
  }

  // User reduce
  private userReduce(users: User[]) {
    const studentsByDirection: IStudentsByDirection = users?.reduce(
      (acc, { direction }) => {
        const directionJoin = direction.toLowerCase().split(' ').join('_');
        if (acc.hasOwnProperty(directionJoin)) {
          acc[directionJoin] = acc[directionJoin] + 1;
        } else {
          acc[directionJoin] = 1;
        }
        return acc;
      },
      {},
    );
    return studentsByDirection;
  }
}
