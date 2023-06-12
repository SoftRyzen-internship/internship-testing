import { Injectable, UnauthorizedException } from '@nestjs/common'
import { CanActivate, ExecutionContext } from '@nestjs/common/interfaces'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { MyRequest } from '@src/types/request.interface'
import { Observable } from 'rxjs'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<MyRequest>()
    try {
      let token: string
      if (req.headers.authorization) {
        const authHeader = req.headers.authorization
        const bearer = authHeader.split(' ')[0]
        token = authHeader.split(' ')[1]

        if (bearer !== 'Bearer' || !token) {
          throw new UnauthorizedException('Not authorized')
        }
      } else if (req.cookies && req.cookies.refreshToken) {
        token = req.cookies.refreshToken
      } else {
        throw new UnauthorizedException('Token not found')
      }

      const secretKey =
        token === req.cookies.refreshToken
          ? this.configService.get<string>('REFRESH_TOKEN_PRIVATE_KEY')
          : this.configService.get<string>('ACCESS_TOKEN_PRIVATE_KEY')

      const user = this.jwtService.verify(token, {
        secret: secretKey,
      })
      req.user = user
      return true
    } catch (e) {
      throw new UnauthorizedException(`Not authorized ${e.message}`)
    }
  }
}
