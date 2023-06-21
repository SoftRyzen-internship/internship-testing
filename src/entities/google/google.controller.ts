import { LoginResponseDto } from '@entities/auth/dto/login.dto';
import { User } from '@entities/users/users.entity';
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
import { InjectRepository } from '@nestjs/typeorm';
import { MyRequest } from '@src/types/request.interface';
import { Response } from 'express';
import { Repository } from 'typeorm';
import { GoogleService } from './google.service';

@ApiTags('Google authentication')
@Controller('/api/google')
export class GoogleController {
  private readonly expirationDate: Date;
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly googleService: GoogleService,
  ) {
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
    try {
      const { email } = req.user;
      let userData;
      const user = await this.userRepository.findOne({ where: { email } });
      if (user) {
        userData = await this.googleService.auth(email);
      } else {
        const registerData = await this.googleService.registerWithGoogle(email);
        userData = registerData.userInfo;
        res.cookie('successToken', registerData.tokens.successToken);
        res.cookie('refreshToken', registerData.tokens.refreshToken);
      }

      const redirectUrl = `${
        process.env.GOOGLE_REDIRECT_URL
      }?userData=${encodeURIComponent(JSON.stringify(userData))}`;
      res.cookie('refreshToken', userData.refreshToken, {
        expires: this.expirationDate,
        httpOnly: true,
      });
      res.redirect(redirectUrl);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
