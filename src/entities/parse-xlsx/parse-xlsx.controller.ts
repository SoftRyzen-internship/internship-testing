import { JwtAuthGuard } from '@guards/jwtGuard/jwt-auth.guard';
import { Roles } from '@guards/roleGuard/decorators/role.decorator';
import { RoleGuard } from '@guards/roleGuard/role.guard';
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
  ApiForbiddenResponse,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ERole } from '@src/enums/role.enum';
import { ParseXlsxDto, ResponseParseXlsxDto } from './dto/parse-xlsx.dto';
import { ParseXlsxService } from './parse-xlsx.service';
import { MyRequest } from '@src/types/request.interface';

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
