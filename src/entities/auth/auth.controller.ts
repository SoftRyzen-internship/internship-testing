
import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { PhoneDto } from './dto/phone.dto';
import { User } from '@entities/users/users.entity';
import { RegisterUserDto } from './dto/create-user.dto';

@ApiTags('Authentication')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({ status: 200, type: String, description: 'OK' })
  @Post('check-phone')
  async checkPhone(@Body() body: PhoneDto) {
    return this.authService.checkPhone(body.phone);
  }

  @Post('register')
   @ApiOperation({ summary: 'Register a new user' })
   @ApiResponse({status: 201, type: RegisterUserDto})
   async registerUser(
    @Body(ValidationPipe) registerUserDto: RegisterUserDto
) :Promise<User> {
    return this.authService.registerUser(registerUserDto)
}

}
