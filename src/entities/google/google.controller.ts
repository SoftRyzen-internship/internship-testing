import { LoginResponseDto } from '@entities/auth/dto/login-response.dto';
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
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@entities/users/users.entity';
import { Repository } from 'typeorm';

@ApiTags('Google authentication')
@Controller('/api/google')
export class GoogleController {
  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>,private readonly googleService: GoogleService) {}

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
      res.cookie('refreshToken', registerData.tokens.refreshToken)
    }

    res.cookie('userData', JSON.stringify(userData));
    res.redirect(process.env.GOOGLE_REDIRECT_URL);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}
}
