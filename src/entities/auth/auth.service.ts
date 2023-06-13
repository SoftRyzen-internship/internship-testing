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
import createToken from '@utils/createToken';
import * as bcrypt from 'bcrypt';
import { v4  } from "uuid";
import { Repository } from 'typeorm';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RegisterUserDto } from './dto/create-user.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { LoginAttemptsService } from './login-attempts.service';
import { MailService } from '@entities/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly loginAttemptsService: LoginAttemptsService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService
  ) {}

  async registerUser(registerUserDto: RegisterUserDto): Promise<User> {
    const { email, password, firstName } = registerUserDto;
    const user = await this.userRepository.findOne({ where: { email } });

    if (user) {
      throw new ConflictException('User is already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const avatar = '/avatars/avatar_pokemon.png';
    const verifyToken = v4();
    const verifyLink = `<a target ="_blank" href="http://localhost:3000/api/auth/verify/${verifyToken}">  Hi ${firstName}! Verify email </a>`;
    // Логику добавления к потоку реализуем когда появятся сами потоки
    const nameInternshipStream = 'Current Thread';

    const newUser = this.userRepository.create({
      ...registerUserDto,
      password: hashedPassword,
      avatar,
      nameInternshipStream, 
      verifyToken,
      verified: false
    });
    const { accessToken, refreshToken } = createToken(newUser.id);
    newUser.accessToken = accessToken;
    newUser.refreshToken = refreshToken;
    await this.userRepository.save(newUser);
    await this.mailService.sendEmail(email, firstName, verifyLink)
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
    const user = await this.getUser(field, value);
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      await this.loginAttemptsService.attempts(userIp);
      throw new UnauthorizedException('Password is wrong');
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
    throw new NotFoundException('No such user');
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

  async verifyEmail(@Param('verificationToken') verifyToken: string):Promise<{message: string}>{
    const user = await this.userRepository.findOne({ where: { verifyToken } })
    if(!user){
    throw new NotFoundException('User not found')
    }
    await this.userRepository.update(user.id, {
      verified: true,
      verifyToken: ''
    })
  
    return { message: 'Verification successful' };
  }
}
