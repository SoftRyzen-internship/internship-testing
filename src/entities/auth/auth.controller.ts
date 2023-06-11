import { Body, Controller, Post, Req } from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { MyRequest } from '@src/types/request.interface';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { PhoneDto } from './dto/phone.dto';

@ApiTags('Authentication')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({ status: 200, type: LoginResponseDto })
  @ApiUnauthorizedResponse({
    description: 'Email is wrong, or password is wrong, or not verified',
  })
  @ApiTooManyRequestsResponse({
    description:
      'Too many failed login attempts. Please try again after 15 minutes.',
  })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Req() req: MyRequest) {
    const data = await this.authService.login(loginDto, req.ip);
    return { user: data.user };
  }

  @ApiOkResponse({ description: 'OK' })
  @ApiConflictResponse({ description: 'Phone number already exists' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @ApiConflictResponse({
    description: 'Phone number already exists',
  })
  @Post('check-phone')
  async checkPhone(@Body() body: PhoneDto) {
    return this.authService.checkPhone(body.phone);
  }
}
