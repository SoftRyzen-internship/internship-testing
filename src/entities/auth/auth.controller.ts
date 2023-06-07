import { Controller, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

@Get('check-email')
@ApiOperation({ summary: 'Check email uniqueness' })
  @ApiQuery({ name: 'email', description: 'Email to check', example: 'example@example.com' })
  @ApiResponse({ status: 200, description: 'Returns if the email is unique or not' })
  async checkEmailUnique(@Query('email') email: string): Promise<{ unique: boolean }> {
    const isUnique = await this.authService.checkEmailUnique(email);
    return { unique: isUnique };
  }

}
