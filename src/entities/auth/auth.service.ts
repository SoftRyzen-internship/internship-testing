import { InternshipStream } from '@entities/internship-stream/internship-stream.entity';
import { MailService } from '@entities/mail/mail.service';
import { Role } from '@entities/users/role.entity';
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
import { ERole } from '@src/enums/role.enum';
import * as bcrypt from 'bcrypt';
import * as code from 'country-data';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RegisterUserDto } from './dto/create-user.dto';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import { PhoneCodeDto } from './dto/phone.dto';
import { SetRedisService } from './set-redis.service';

@Injectable()
export class AuthService {
  private readonly countriesCodeAll: any;
  constructor(
    private readonly setRedisService: SetRedisService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(InternshipStream)
    private readonly streamRepository: Repository<InternshipStream>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {
    this.countriesCodeAll = code.countries.all;
  }

  // Register
  async registerUser(registerUserDto: RegisterUserDto): Promise<User> {
    const { email, password } = registerUserDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (user) {
      throw new ConflictException('User is already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const verifyToken = v4();
    const verifyLink = this.generateUrlForEmailSend(
      email,
      `verify`,
      verifyToken,
    );

    const role = this.roleRepository.create({
      role: ERole.USER,
    });

    const newUser = this.userRepository.create({
      ...registerUserDto,
      password: hashedPassword,
      verifyToken,
    });

    newUser.roles = [role];
    await this.mailService.sendEmail(email, verifyLink);
    await this.roleRepository.save(role);
    await this.userRepository.save(newUser);

    return newUser;
  }

  // Verify email
  async verifyEmail(verifyToken: string) {
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
    const user = await this.userValidate(
      loginDto.email,
      loginDto.password,
      userIp,
    );

    return await this.responseData(user.email);
  }

  // Response data
  public async responseData(email: string) {
    const user = await this.getUser('email', email);
    const tokens = await this.generateTokens(user);
    const roles: string[] = user.roles.map((role) => role.role);
    const stream: InternshipStream = await this.streamRepository.findOne({
      where: { id: user.streamId },
    });
    const streamData = {
      id: stream?.id,
      streamDirection: stream?.streamDirection,
      isActive: stream?.isActive,
      startDate: stream?.startDate,
    };
    const userData = {
      id: user.id,
      roles,
      isLabelStream: user.isLabelStream,
      stream: stream ? streamData : {},
    };
    const responseData: LoginResponseDto = {
      successToken: tokens.successToken,
      refreshToken: tokens.refreshToken,
      user: userData,
    };

    if (!user.firstName || !user.phone) {
      return responseData;
    }

    userData['firstName'] = user.firstName;
    userData['avatar'] = user.avatar;
    userData['direction'] = user.direction;

    return responseData;
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
  public async requestChangePassword(email: string) {
    const user = await this.getUser('email', email);
    const verifyToken = v4();
    const verifyLink = this.generateUrlForEmailSend(
      user.firstName,
      'verify-change-password',
      verifyToken,
    );
    const isSendEmail = await this.mailService.sendEmail(
      user.email,
      verifyLink,
      user.firstName,
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

  // Refresh token
  public async refreshToken(user: User) {
    const tokens = await this.generateTokens(user);
    return {
      successToken: tokens.successToken,
      refreshToken: tokens.refreshToken,
    };
  }

  // Get phone code
  public async getPhoneCode() {
    const allCode: PhoneCodeDto[] = [];

    for (const country of this.countriesCodeAll) {
      allCode.push({
        phone_code: country.countryCallingCodes[0],
        name: country.name,
        alpha2: country.alpha2,
        flag_url: `https://flagcdn.com/${country.alpha2.toLowerCase()}.svg`,
      });
    }

    return allCode;
  }

  // User validate
  private async userValidate(email: string, password: string, userIp: string) {
    const user = await this.getUser('email', email);
    if (!user.password) {
      throw new BadRequestException('Update your password');
    }
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
    throw new NotFoundException('Not found');
  }

  // Generate tokens
  private async generateTokens(user: User) {
    const roles = user.roles.map((role) =>
      typeof role === 'string' ? role : role.role,
    );

    const payload = { email: user.email, id: user.id, roles };

    const successToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
      secret: process.env.ACCESS_TOKEN_PRIVATE_KEY || 'SUCCESS_TOKEN',
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: process.env.REFRESH_TOKEN_PRIVATE_KEY || 'REFRESH_TOKEN',
    });
    await this.setRedisService.setRefreshToken(user.email, refreshToken);
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
