import { JwtAuthGuard } from '@guards/jwtGuard/jwt-auth.guard';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { MyRequest } from '@src/types/request.interface';
import { AuthService } from './auth.service';
import {
  AuthDto,
  AuthResponseDto,
  LogoutResponseDto,
  PhoneDto,
  RegularExpressionResponseDto,
} from './dto/auth.dto';

@ApiTags('Authentication')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Register
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, type: AuthResponseDto })
  public async registerUser(@Body(ValidationPipe) body: AuthDto) {
    return await this.authService.registerUser(body);
  }

  // Login
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 201, type: AuthResponseDto })
  @ApiUnauthorizedResponse({
    description: 'Email is wrong, or password is wrong or email not verified',
  })
  @ApiTooManyRequestsResponse({
    description:
      'Too many failed login attempts. Please try again after 15 minutes.',
  })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @Post('login')
  public async login(@Body() body: AuthDto, @Req() req: MyRequest) {
    const data = await this.authService.login(body, req.ip);
    return {
      refreshToken: data.refreshToken,
      accessToken: data.accessToken,
    };
  }

  // Check phone
  @ApiOperation({ summary: 'Check phone' })
  @ApiResponse({ status: 201, description: 'OK' })
  @ApiConflictResponse({ description: 'Phone number already exists' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @Post('check-phone')
  public async checkPhone(@Body() body: PhoneDto) {
    return this.authService.checkPhone(body.phone);
  }

  // Get regular expression
  @ApiOperation({ summary: 'Get regular expression' })
  @ApiResponse({ status: 200, type: RegularExpressionResponseDto })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @Get('regular-expression')
  getRegularExpression() {
    return this.authService.getRegularExpression();
  }

  // Logout
  @ApiOperation({ summary: 'Logout' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Access token with type',
    required: true,
    schema: {
      type: 'string',
      format: 'Bearer YOUR_TOKEN_HERE, token-type=access_token',
    },
  })
  @ApiResponse({ status: 200, type: LogoutResponseDto })
  @ApiUnauthorizedResponse({
    description:
      'Not authorized jwt expired || Not authorized Invalid token type',
  })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard)
  @Get('logout')
  public async logout(@Req() req: MyRequest) {
    await this.authService.logout(req.user.email);
    return { message: 'Disconnect...' };
  }
}
