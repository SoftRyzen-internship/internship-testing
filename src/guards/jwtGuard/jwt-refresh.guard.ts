import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common/interfaces';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MyRequest } from '@src/types/request.interface';
import { Observable } from 'rxjs';

@Injectable()
export class JwtRefreshGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
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
      req.user = user;
      return true;
    } catch (e) {
      throw new UnauthorizedException(`Not authorized ${e.message}`);
    }
  }
}
