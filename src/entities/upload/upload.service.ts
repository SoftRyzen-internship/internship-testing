import { User } from '@entities/users/users.entity';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import { MulterError } from 'multer';
import { extname, join } from 'path';
import { Repository } from 'typeorm';
import { UploadDto } from './dto/upload.dto';

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async uploadFile(email: string, file: UploadDto) {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        throw new UnauthorizedException('Not authorized');
      }
      const destinationDirectory = `./public/avatars`;
      if (!fs.existsSync(destinationDirectory)) {
        fs.mkdirSync(destinationDirectory, { recursive: true });
      }
      const newFileName = Date.now() + extname(file.originalname);
      const newPath = `${destinationDirectory}/${newFileName}`;
      await this.userRepository.update(email, { avatar: newPath });
      fs.renameSync(file.path, newPath);
      return { filename: newFileName, path: newPath };
    } catch (error) {
      fs.unlinkSync(join(__dirname, '../../../', 'temp'));
      if (error instanceof MulterError) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException();
    }
  }
}
