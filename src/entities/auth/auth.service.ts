import { RedisCacheService } from '@entities/redis/redis.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly userService: any;
  constructor(private readonly cache: RedisCacheService) {}

  async login(loginDto: LoginDto) {
    // const user = await this.validateUser(loginDto);
    await this.cache.set('user', 'user');
  }

  async get(key: string) {
    // const user = await this.validateUser(loginDto);
    return await this.cache.get(key);
  }

  private async validateUser({ username, password }: LoginDto) {
    const field = username.includes('@') ? 'email' : 'phone';
    const user = await this.userService.getUser(field, username);
    const passwordEquals = await bcrypt.compare(password, user.password);
    if (user && passwordEquals && !user.verificationToken) {
      return user;
    }
    throw new UnauthorizedException(
      'Email is wrong, or password is wrong, or not verified',
    );
  }
}
