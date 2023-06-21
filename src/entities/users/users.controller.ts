import { LoginResponseDto } from '@entities/auth/dto/login.dto';
import { JwtAuthGuard } from '@guards/jwtGuard/jwt-auth.guard';
import {
  Body,
  Controller,
  Get,
  Patch,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { MyRequest } from '@src/types/request.interface';
import { Response } from 'express';
import { ResponseDashboardDto } from './dto/response-dashboard.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { UpdateDirectionDto } from './dto/update-direction.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './users.service';

@ApiTags('User')
@Controller('api/users')
export class UserController {
  private readonly expirationDate: Date;
  constructor(private readonly userService: UserService) {
    this.expirationDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }

  // Current user
  @ApiOperation({ summary: 'Current user' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Access token',
    required: true,
  })
  @ApiResponse({ status: 200, type: LoginResponseDto })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard)
  @Get('current')
  public async currentUser(@Req() req: MyRequest, @Res() res: Response) {
    const data = await this.userService.currentUser(req.user.email);
    res.cookie('refreshToken', data.refreshToken, {
      expires: this.expirationDate,
      httpOnly: true,
    });
    res.send({ token: data.successToken, user: data.user });
  }

  // Update user
  @ApiOperation({ summary: 'Update user' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Access token',
    required: true,
  })
  @ApiResponse({ status: 200, type: ResponseUserDto })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard)
  @Put('update')
  public async updateUser(@Body() body: UpdateUserDto, @Req() req: MyRequest) {
    return await this.userService.updateUser(req.user.email, body);
  }

  // Update direction
  @ApiOperation({ summary: 'Update user`s direction' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Access token',
    required: true,
  })
  @ApiResponse({ status: 200, type: ResponseUserDto })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard)
  @Patch('direction')
  public async updateUserDirection(
    @Body() body: UpdateDirectionDto,
    @Req() req: MyRequest,
  ) {
    return await this.userService.updateUserDirection(req.user.email, body);
  }

  // Dashboard
  @ApiOperation({ summary: 'Dashboard' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Access token',
    required: true,
  })
  @ApiResponse({ status: 200, type: ResponseDashboardDto })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard)
  @Get('dashboard')
  public async dashboard() {
    return await this.userService.dashboard();
  }
}
