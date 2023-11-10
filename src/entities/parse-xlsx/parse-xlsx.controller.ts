import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ParseXlsxDto } from './dto/parse-xlsx.dto';
import { ParseXlsxService } from './parse-xlsx.service';
import { ResponseCreateQuestionDto } from '@entities/questions/dto/quest.dto';
import { JwtAuthGuard } from '@guards/jwtGuard/jwt-auth.guard';
import { Roles } from '@guards/roleGuard/decorators/role.decorator';
import { RoleGuard } from '@guards/roleGuard/role.guard';
import { ERole } from '@src/enums/role.enum';

@ApiTags('Parse xlsx file')
@Controller('api/parse-xlsx')
export class ParseXlsxController {
  constructor(private readonly parseXlsxService: ParseXlsxService) {}

  // Upload file
  @ApiOperation({ summary: 'Upload file .xlsx' })
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
  @ApiOkResponse({ description: 'OK', type: [ResponseCreateQuestionDto] })
  @ApiNotFoundResponse({ description: 'Block questions not found' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ERole.ADMIN)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  public async uploadFileXlsx(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: ParseXlsxDto,
  ) {
    return await this.parseXlsxService.uploadFileXlsx(file, body);
  }
}
