import { JwtGuardsModule } from '@guards/jwtGuard/jwt-guard.module';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { MyRequest } from '@src/types/request.interface';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto, UsernameDto } from './dto/login.dto';
import { PhoneDto } from './dto/phone.dto';

@ApiTags('Authentication')
@Controller('api/auth')
export class AuthController {
  private readonly expirationDate: Date;
  constructor(private readonly authService: AuthService) {
    this.expirationDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }

  // Login
  @ApiResponse({ status: 200, type: LoginResponseDto })
  @ApiUnauthorizedResponse({
    description: 'Email is wrong, or password is wrong or email not verified',
  })
  @ApiTooManyRequestsResponse({
    description:
      'Too many failed login attempts. Please try again after 15 minutes.',
  })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: MyRequest,
    @Res() res: Response,
  ) {
    const data = await this.authService.login(loginDto, req.ip);
    res.cookie('refreshToken', data.refreshToken, {
      expires: this.expirationDate,
      httpOnly: true,
    });
    res.send({ token: data.successToken, user: data.user });
  }

  // Check phone
  @ApiOkResponse({ description: 'OK' })
  @ApiConflictResponse({ description: 'Phone number already exists' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @Post('check-phone')
  async checkPhone(@Body() body: PhoneDto) {
    return this.authService.checkPhone(body.phone);
  }

  // Request change password
  @ApiOkResponse({ description: 'OK' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @Post('request-change-password')
  async requestChangePassword(@Body() body: UsernameDto) {
    return this.authService.requestChangePassword(body.username);
  }

  // Verify change password
  @ApiOkResponse({ description: 'OK' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @Get('verify-change-password/:verifyToken')
  async verifyChangePassword(
    @Param('verifyToken') verifyToken: string,
    @Res() res: Response,
  ) {
    const refreshToken = await this.authService.verifyChangePassword(
      verifyToken,
    );
    res.cookie('refreshToken', refreshToken, {
      expires: this.expirationDate,
      httpOnly: true,
    });
    res.redirect(process.env.REDIRECT_TO_PASSWORD_CHANGE_FORM);
  }

  // Change password
  @ApiOkResponse({ description: 'Password changed' })
  @ApiBadRequestResponse({ description: 'Passwords do not match' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtGuardsModule)
  @Post('change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: MyRequest,
  ) {
    return this.authService.changePassword(changePasswordDto, req.user.id);
  }
}
