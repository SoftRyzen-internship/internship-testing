import { RedisCacheService } from '@entities/redis/redis.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common/interfaces';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MyRequest } from '@src/types/request.interface';

@Injectable()
export class JwtRefreshGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly redisCacheService: RedisCacheService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<MyRequest>();
    try {
      let token: string;
      if (req.cookies && req.cookies.refreshToken) {
        token = req.cookies.refreshToken;
      } else {
        throw new UnauthorizedException('Token not found');
      }

      const user = this.jwtService.verify(token, {
        secret: this.configService.get<string>('REFRESH_TOKEN_PRIVATE_KEY'),
      });
      const tokenRedis = await this.redisCacheService.get(
        `refreshToken:${user.email}`,
      );
      if (tokenRedis !== token) {
        throw new UnauthorizedException();
      }
      req.user = user;
      return true;
    } catch (e) {
      throw new UnauthorizedException(`Not authorized ${e.message}`);
    }
  }
}
