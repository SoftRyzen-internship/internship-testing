import { AttemptsService } from '@entities/attempts/attempts.service';
import { InternshipStreamService } from '@entities/internship-stream/internship-stream.service';
import { MailService } from '@entities/mail/mail.service';
import { TokensService } from '@entities/tokens/tokens.service';
import { RoleEntity } from '@entities/users/role.entity';
import { UserEntity } from '@entities/users/users.entity';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VERIFY_EMAIL } from '@src/constants/mail-path.constants';
import * as regex from '@src/constants/regex-expressions';
import { ERole } from '@src/enums/role.enum';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly attemptsService: AttemptsService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    private readonly mailService: MailService,
    private readonly tokensService: TokensService,
    private readonly streamService: InternshipStreamService,
  ) {}

  // Register
  public async registerUser(body: AuthDto) {
    const { email, password } = body;
    const stream = await this.streamService.getActiveInternshipStream();
    if (!stream) {
      throw new BadRequestException('No active stream');
    }
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      throw new ConflictException('User is already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verifyToken = v4();
    await this.mailService.sendEmailHandler(
      email,
      verifyToken,
      VERIFY_EMAIL,
      null,
      false,
    );

    const role = this.roleRepository.create({
      role: ERole.USER,
    });

    const newUser = this.userRepository.create({
      ...body,
      password: hashedPassword,
      verifyToken,
      streamId: stream.id,
    });
    newUser.roles = [role];

    await this.roleRepository.save(role);
    await this.userRepository.save(newUser);

    return await this.tokensService.generateTokens(newUser);
  }

  // Login
  public async login(body: AuthDto, userIp: string) {
    const user = await this.userValidate(body.email, body.password, userIp);

    return await this.tokensService.generateTokens(user);
  }

  // Check phone
  public async checkPhone(phone: string) {
    const user = await this.userRepository.findOne({ where: { phone } });
    if (user) {
      throw new ConflictException('Phone number already exists!');
    }
    return 'OK';
  }

  // Get regular expression
  public async getRegularExpression() {
    const linkRegex = new RegExp(regex.linkRegex).toString();
    const telegramRegex = new RegExp(regex.telegramRegex).toString();
    const phoneRegex = new RegExp(regex.phoneRegex).toString();
    const passwordRegex = new RegExp(regex.passwordRegex).toString();
    const emailRegex = new RegExp(regex.emailRegex).toString();

    return {
      linkRegex,
      telegramRegex,
      phoneRegex,
      passwordRegex,
      emailRegex,
    };
  }

  // Logout
  public async logout(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('Not found');
    }
    await this.userRepository.update(user.id, {
      refreshToken: null,
    });
  }

  // User validate
  private async userValidate(email: string, password: string, userIp: string) {
    const user = await this.getUser('email', email);
    if (!user.password) {
      throw new BadRequestException('Update your password');
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      await this.attemptsService.attempts(userIp);
      throw new UnauthorizedException('Password is wrong');
    }
    if (!user.verified) {
      throw new UnauthorizedException('Email not verified');
    }
    await this.attemptsService.deleteAttempts(userIp);
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
}
