import { User } from '@entities/users/users.entity';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist';
import { InjectRepository } from '@nestjs/typeorm';
import createToken from '@utils/createToken';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RegisterUserDto } from './dto/create-user.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { LoginAttemptsService } from './login-attempts.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly loginAttemptsService: LoginAttemptsService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(registerUserDto: RegisterUserDto): Promise<User> {
    const { email, password } = registerUserDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (user) {
      throw new ConflictException('User is already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const avatar = "'/avatars/avatar_pokemon.png'";
    // Логику добавления к потоку реализуем когда появятся сами потоки
    const currentThread = 'Current Thread';

    const newUser = this.userRepository.create({
      ...registerUserDto,
      password: hashedPassword,
      avatar: avatar,
      currentThread: currentThread,
    });
    const { accessToken, refreshToken } = createToken(newUser.id);
    newUser.accessToken = accessToken;
    newUser.refreshToken = refreshToken;
    await this.userRepository.save(newUser);
    return newUser;
  }

  public async login(loginDto: LoginDto, userIp: string) {
    const field = this.checkEmailOrPhone(loginDto.username);
    const user = await this.userValidate(
      field,
      loginDto.username,
      loginDto.password,
      userIp,
    );

    const tokens = await this.generateTokens(user);
    console.log('tokens', tokens);

    const userData: LoginResponseDto = {
      id: user.id,
      username: user.firstName,
      fieldOfInternship: '', // !
      nameInternshipStream: '', // !
    };
    return {
      successToken: tokens.successToken,
      refreshToken: tokens.refreshToken,
      user: userData,
    };
  }

  public async checkPhone(phone: string) {
    const user = await this.userRepository.findOne({ where: { phone } });
    if (user) {
      throw new ConflictException('Phone number already exists');
    }
    return 'OK';
  }

  public async requestChangePassword(value: string) {
    const field = this.checkEmailOrPhone(value);
    const user = await this.getUser(field, value);
    const verifyToken = v4();
    const isSendEmail = true; // ! add method for send email
    if (!isSendEmail) {
      throw new InternalServerErrorException();
    }

    await this.userRepository.update(user.id, { verifyToken });
    return 'ok';
  }

  public async verifyChangePassword(verifyToken: string) {
    const user = await this.getUser('verifyToken', verifyToken);

    if (user.verifyToken !== verifyToken) {
      throw new BadRequestException();
    }

    await this.userRepository.update(user.id, { verifyToken: null });
    const { refreshToken } = await this.generateTokens(user);
    return refreshToken;
  }

  public async changePassword(
    changePasswordDto: ChangePasswordDto,
    userId: number,
  ) {
    const { password, confirmPassword } = changePasswordDto;
    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    const hashPass = await bcrypt.hash(password, 10);
    await this.userRepository.update(userId, { password: hashPass });
    return { message: 'Password changed' };
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
    if (!user || !bcrypt.compare(password, user.password)) {
      await this.loginAttemptsService.attempts(userIp);
      throw new UnauthorizedException('Email is wrong, or password is wrong');
    }
    if (!user.verified) {
      throw new UnauthorizedException('Email not verified');
    }
    return user;
  }

  private async getUser(field: string, value: string) {
    const user = await this.userRepository.findOne({
      where: { [field]: value },
    });
    if (user) {
      return user;
    }
    throw new NotFoundException();
  }

  private checkEmailOrPhone(value: string) {
    return value.includes('@') ? 'email' : 'phone';
  }

  private async generateTokens(user: User) {
    const payload = { email: user.email, id: user.id };

    const successToken = this.jwtService.sign(payload, {
      expiresIn: '5m',
      secret: process.env.ACCESS_TOKEN_PRIVATE_KEY || 'SUCCESS_TOKEN',
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: process.env.REFRESH_TOKEN_PRIVATE_KEY || 'REFRESH_TOKEN',
    });
    return {
      successToken,
      refreshToken,
    };
  }
}
