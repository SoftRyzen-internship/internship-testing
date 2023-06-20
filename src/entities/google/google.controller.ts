import { LoginResponseDto } from '@entities/auth/dto/login.dto';
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MyRequest } from '@src/types/request.interface';
import { Response } from 'express';
import { GoogleService } from './google.service';

@ApiTags('Google authentication')
@Controller('api/google')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  @ApiOperation({ summary: 'Google login' })
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @ApiOperation({ summary: 'Google callback' })
  @ApiResponse({ status: 200, type: LoginResponseDto })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @Get('/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: MyRequest, @Res() res: Response) {
    const userData = await this.googleService.auth(req.user.email);
    res.cookie('userData', JSON.stringify(userData));
    res.redirect(process.env.GOOGLE_REDIRECT_URL);
  }
}
