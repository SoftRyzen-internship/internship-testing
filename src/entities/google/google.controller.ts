import { LoginResponseDto } from '@entities/auth/dto/login.dto';
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MyRequest } from '@src/types/request.interface';
import { Response } from 'express';
import { GoogleService } from './google.service';

@ApiTags('Google authentication')
@Controller('api/google')
export class GoogleController {
  private readonly expirationDate: Date;
  constructor(private readonly googleService: GoogleService) {
    this.expirationDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }

  @ApiOperation({ summary: 'Google login' })
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @ApiOperation({
    summary: 'Google callback',
  })
  @ApiQuery({
    name: 'userData',
    description: 'User data encoded in URL',
    type: 'string',
    required: true,
    example:
      '{successToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..., user: {id: 1, ...}}',
  })
  @ApiResponse({ status: 200, type: LoginResponseDto })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @Get('/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: MyRequest, @Res() res: Response) {
    const userData = await this.googleService.auth(req.user.email);
    const redirectUrl = `${
      process.env.GOOGLE_REDIRECT_URL
    }?userData=${encodeURIComponent(JSON.stringify(userData))}`;
    res.cookie('refreshToken', userData.refreshToken, {
      expires: this.expirationDate,
      httpOnly: true,
    });
    res.redirect(redirectUrl);
  }
}
