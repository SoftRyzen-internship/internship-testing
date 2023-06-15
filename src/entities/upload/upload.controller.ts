import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MyRequest } from '@src/types/request.interface';
import { Response } from 'express';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import { JwtAuthGuard } from 'src/guards/jwtGuard/jwt-auth.guard';
import { ResponseUploadDto } from './dto/response-upload.dto';
import { UploadDto } from './dto/upload.dto';
import { UploadService } from './upload.service';

@ApiTags('Upload file')
@Controller('api/upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiOperation({ summary: 'Upload file' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Access token',
    required: true,
  })
  @ApiOkResponse({ description: 'File uploaded successfully' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File to upload',
    type: UploadDto,
  })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard)
  @Post('avatars')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, callback) => {
          const directory = `./temp`;
          if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
          }
          callback(null, directory);
        },
        filename: (req, file, callback) => {
          callback(null, file.originalname);
        },
      }),
      fileFilter: (req, file, callback) => {
        const allowedMimeType = ['image/png', 'image/jpg', 'image/jpeg'];
        if (allowedMimeType.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(new BadRequestException('Invalid file type'), false);
        }
      },
      limits: {
        fileSize: 1024 * 1024, // 1MB
      },
    }),
  )
  async uploadFile(
    @UploadedFile(new ValidationPipe()) file: UploadDto,
    @Param('path') path: string,
    @Req() req: MyRequest,
  ) {
    const { email } = req.user;
    return await this.uploadService.uploadFile(email, file);
  }

  @ApiOperation({ summary: 'Get file' })
  @ApiBearerAuth()
  @ApiHeader({
    name: 'Authorization',
    description: 'Access token',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Url file',
    type: ResponseUploadDto,
  })
  @ApiNotFoundResponse({ description: 'Not found' })
  @ApiInternalServerErrorResponse({ description: 'Server error' })
  @UseGuards(JwtAuthGuard)
  @Get('public/:path/:filename')
  async getImage(
    @Param('path') path: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    return res.sendFile(filename, { [path]: `public/${path}` });
  }
}
