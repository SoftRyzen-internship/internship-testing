import { JwtAuthGuard } from '@guards/jwtGuard/jwt-auth.guard';
import {
  Body,
  Controller,
  Get,
  Patch,
  Put,
  Req,
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
} from '@nestjs/swagger';
import { MyRequest } from '@src/types/request.interface';
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
}
