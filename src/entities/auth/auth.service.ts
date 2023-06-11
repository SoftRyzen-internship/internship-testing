import { User } from '@entities/users/users.entity';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { LoginAttemptsService } from './login-attempts.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly loginAttemptsService: LoginAttemptsService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  public async checkPhone(phone: string) {
    const user = await this.userRepository.findOne({ where: { phone } });
    if (user) {
      throw new ConflictException('Phone number already exists');
    }
    return 'OK';
  }

  public async login(loginDto: LoginDto, userIp: string) {
    const field = loginDto.username.includes('@') ? 'email' : 'phone';
    const user = await this.userValidate(
      field,
      loginDto.username,
      loginDto.password,
      userIp,
    );

    const userData: LoginResponseDto = {
      id: user.id,
      username: user.firstName,
      fieldOfInternship: '',
      nameInternshipStream: '',
    };
    return {
      user: userData,
    };
  }

  private async userValidate(
    field: string,
    value: string,
    password: string,
    userIp: string,
  ) {
    const user = await this.userRepository.findOne({
      where: { [field]: value },
    });
    if (!user || !bcrypt.compare(password, user.password) || !user.verified) {
      await this.loginAttemptsService.attempts(userIp);
      throw new UnauthorizedException(
        'Email is wrong, or password is wrong, or not verified',
      );
    }
    return user;
  }
}
