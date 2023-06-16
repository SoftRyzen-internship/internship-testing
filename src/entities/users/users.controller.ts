import { JwtAuthGuard } from '@guards/jwtGuard/jwt-auth.guard';
import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
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
import { ResponseDashboardDto } from './dto/response-dashboard.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './users.service';

@ApiTags('User')
@Controller('api/users')
export class UserController {
  private readonly expirationDate: Date;
  constructor(private readonly userService: UserService) {
    this.expirationDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }

  // Get user by id
  @ApiOperation({ summary: 'Get current user' })
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
  @Get('current')
  public async currentUser(@Req() req: MyRequest) {
    return this.userService.getUser(req.user.email);
  }

  // Update user
  @ApiOperation({ summary: 'Update user' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Access token',
    required: true,
  })
  @ApiResponse({ status: 200, description: 'User updated' })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard)
  @Put('update')
  public async updateUser(@Body() body: UpdateUserDto, @Req() req: MyRequest) {
    await this.userService.updateUser(req.user.email, body);
    return { message: 'User Updated' };
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
