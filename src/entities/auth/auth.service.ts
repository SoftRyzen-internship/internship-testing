import { MailService } from '@entities/mail/mail.service';
import { Role } from '@entities/users/role.entity';
import { User } from '@entities/users/users.entity';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist';
import { InjectRepository } from '@nestjs/typeorm';
import { ERole } from '@src/enums/role.enum';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RegisterUserDto } from './dto/create-user.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { SetRedisService } from './set-redis.service';


@Injectable()
export class AuthService {
  constructor(
    private readonly setRedisService: SetRedisService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  // Register
  async registerUser(registerUserDto: RegisterUserDto): Promise<User> {
    const { email, password, firstName } = registerUserDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (user) {
      throw new ConflictException('User is already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const avatar = '/avatars/avatar_pokemon.png';
    const verifyToken = v4();
    const verifyLink = this.generateUrlForEmailSend(firstName,`verify` ,verifyToken)
    const nameInternshipStream = 'Current Thread';

    const role = this.roleRepository.create({
      role: ERole.USER,
    });

    const newUser = this.userRepository.create({
      ...registerUserDto,
      password: hashedPassword,
      avatar,
      nameInternshipStream,
      verifyToken,
      verified: false,
    });

    newUser.roles = [role];

    await this.roleRepository.save(role);
    await this.userRepository.save(newUser);
    await this.mailService.sendEmail(email, firstName, verifyLink);
   
    return newUser;
  }

  // Verify email
  async verifyEmail(@Param('verificationToken') verifyToken: string) {
    const user = await this.userRepository.findOne({ where: { verifyToken } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
   
    await this.userRepository.update(user.id, {
      verified: true,
      verifyToken: null,
    });
    const tokens = await this.generateTokens(user);


    return tokens.refreshToken;
  }

  // Login
  public async login(loginDto: LoginDto, userIp: string) {
    const field = this.checkEmailOrPhone(loginDto.username);
    const user = await this.userValidate(
      field,
      loginDto.username,
      loginDto.password,
      userIp,
    );

    const tokens = await this.generateTokens(user);

    const userData: LoginResponseDto = {
      id: user.id,
      username: user.firstName,
      fieldOfInternship: user.fieldOfInternship,
      nameInternshipStream: user.nameInternshipStream,
    };
    await this.setRedisService.setRefreshToken(user.email, tokens.refreshToken);
    return {
      successToken: tokens.successToken,
      refreshToken: tokens.refreshToken,
      user: userData,
    };
  }

  // Check phone
  public async checkPhone(phone: string) {
    const user = await this.userRepository.findOne({ where: { phone } });
    if (user) {
      throw new ConflictException('Phone number already exists');
    }
    return 'OK';
  }

  // Request change password
  public async requestChangePassword(value: string) {
    const field = this.checkEmailOrPhone(value);
    const user = await this.getUser(field, value);
    const verifyToken = v4();
    const verifyLink = this.generateUrlForEmailSend(
      user.firstName,
      'verify-change-password',
      verifyToken,
    );
    const isSendEmail = await this.mailService.sendEmail(
      user.email,
      user.firstName,
      verifyLink,
    );
    if (!isSendEmail) {
      throw new InternalServerErrorException();
    }

    await this.userRepository.update(user.id, { verifyToken });
    return 'ok';
  }

  // Verify change password
  public async verifyChangePassword(verifyToken: string) {
    const user = await this.getUser('verifyToken', verifyToken);

    await this.userRepository.update(user.id, { verifyToken: null });
    const { refreshToken } = await this.generateTokens(user);
    await this.setRedisService.setRefreshToken(user.email, refreshToken);
    return refreshToken;
  }

  // Change password
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

  // User validate
  private async userValidate(
    field: string,
    value: string,
    password: string,
    userIp: string,
  ) {
    const user = await this.getUser(field, value);
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      await this.setRedisService.attempts(userIp);
      throw new UnauthorizedException('Password is wrong');
    }
    if (!user.verified) {
      throw new UnauthorizedException('Email not verified');
    }
    return user;
  }

  // Get user
  private async getUser(field: string, value: string) {
    const user = await this.userRepository.findOne({
      where: { [field]: value },
      relations: ['roles'],
    });
    if (user) {
      return user;
    }
    throw new NotFoundException('No such user');
  }

  private checkEmailOrPhone(value: string) {
    return value.includes('@') ? 'email' : 'phone';
  }

  // Generate tokens
  private async generateTokens(user: User) {
    const roles = user.roles?.map((role) => role.role);
    const payload = { email: user.email, id: user.id, roles };

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

  // Generate url for email send
  private generateUrlForEmailSend(
    name: string,
    path: string,
    verifyToken: string,
  ) {
    return `<p>Hi ${name}, please confirm that this is your email address</p><a href="http://${process.env.BASE_URL}/api/auth/${path}/${verifyToken}">Confirm email</a>`;
  }
}
