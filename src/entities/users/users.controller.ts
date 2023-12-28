import { JwtAuthGuard } from '@guards/jwtGuard/jwt-auth.guard';
import { Roles } from '@guards/roleGuard/decorators/role.decorator';
import { RoleGuard } from '@guards/roleGuard/role.guard';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ERole } from '@src/enums/role.enum';
import { MyRequest } from '@src/types/request.interface';
import { ResponseCurrentUserDto } from './dto/response-user.dto';
import { UpdateDirectionDto } from './dto/update-direction.dto';
import { CandidateProgressUpdatesDto, UserDto } from './dto/update-user.dto';
import { UserService } from './users.service';

@ApiTags('User')
@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Current user
  @ApiOperation({ summary: 'Current user' })
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
  @ApiResponse({ status: 200, type: ResponseCurrentUserDto })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({ description: 'Not authorized Invalid token type' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard)
  @Get('current')
  public async currentUser(@Req() req: MyRequest) {
    const data = await this.userService.currentUser(req.user.email);
    return {
      refreshToken: data.refreshToken,
      accessToken: data.accessToken,
      user: data.user,
    };
  }

  // Update user
  @ApiOperation({ summary: 'Update user' })
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
  @ApiResponse({ status: 200, type: ResponseCurrentUserDto })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiBadRequestResponse({ description: "You can't choose this direction" })
  @ApiUnauthorizedResponse({
    description:
      'Not authorized jwt expired || Not authorized Invalid token type',
  })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard)
  @Patch('update')
  public async updateUser(@Body() body: UserDto, @Req() req: MyRequest) {
    const data = await this.userService.updateUser(req.user.email, body);
    return {
      refreshToken: data.refreshToken,
      accessToken: data.accessToken,
      user: data.user,
    };
  }

  // Update direction
  @ApiOperation({ summary: 'Update user`s direction' })
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
  @ApiResponse({ status: 200, type: ResponseCurrentUserDto })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiUnauthorizedResponse({
    description:
      'Not authorized jwt expired || Not authorized Invalid token type',
  })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard)
  @Patch('direction')
  public async updateUserDirection(
    @Body() body: UpdateDirectionDto,
    @Req() req: MyRequest,
  ) {
    return await this.userService.updateUserDirection(req.user.email, body);
  }

  // Update stream
  @ApiOperation({ summary: 'Update user`s stream' })
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
  @ApiResponse({ status: 200, type: ResponseCurrentUserDto })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiBadRequestResponse({
    description: 'The user is already registered for this stream',
  })
  @ApiUnauthorizedResponse({
    description:
      'Not authorized jwt expired || Not authorized Invalid token type',
  })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard)
  @Patch(':streamId')
  public async updateUserStream(
    @Param('streamId', ParseIntPipe) streamId: number,
    @Req() req: MyRequest,
  ) {
    return await this.userService.updateUserStream(req.user.email, streamId);
  }

  // Update isSendInterview, isFailedInterview, startDateInterview, isOffer
  @ApiOperation({
    summary:
      'Only admin can update. Update isSendInterview, isFailedInterview, startDateInterview, isOffer.',
  })
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
  @ApiResponse({ status: 200, type: ResponseCurrentUserDto })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiBadRequestResponse({
    description: 'The user is already registered for this stream',
  })
  @ApiUnauthorizedResponse({
    description:
      'Not authorized jwt expired || Not authorized Invalid token type',
  })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ERole.ADMIN)
  @Patch('progress/:userId')
  public async candidateProgressUpdates(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() body: CandidateProgressUpdatesDto,
  ) {
    return await this.userService.candidateProgressUpdates(userId, body);
  }
}
