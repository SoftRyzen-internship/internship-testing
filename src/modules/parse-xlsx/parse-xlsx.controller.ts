import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { ERole } from '@src/enums/role.enum';

import { MyRequest } from '@src/types/request.interface';

import {
  ParseXlsxBodyFileDto,
  ParseXlsxDto,
  ResponseParseXlsxDto,
} from './dto/parse-xlsx.dto';

import { ParseXlsxService } from './parse-xlsx.service';

import { Roles } from '@guards/roleGuard/decorators/role.decorator';

import { JwtAuthGuard } from '@guards/jwtGuard/jwt-auth.guard';
import { RoleGuard } from '@guards/roleGuard/role.guard';

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
  @ApiBody({
    description: 'File to upload',
    type: ParseXlsxBodyFileDto,
  })
  @ApiOkResponse({ description: 'OK', type: ResponseParseXlsxDto })
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
    @Req() req: MyRequest,
  ) {
    return await this.parseXlsxService.uploadFileXlsx(file, body, req.user.id);
  }
}
