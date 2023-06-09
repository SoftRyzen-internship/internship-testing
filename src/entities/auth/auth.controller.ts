import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { PhoneDto } from './dto/phone.dto';

@ApiTags('Authentication')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({ status: 200, type: LoginResponseDto })
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    // return this.authService.login(loginDto);
    return this.authService.get('user');
  }
  @ApiResponse({ status: 200, type: String, description: 'OK' })
  @Post('check-phone')
  async checkPhone(@Body() body: PhoneDto) {
    return this.authService.checkPhone(body.phone);
  }
}
