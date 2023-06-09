import { LoginDto } from '@entities/auth/dto/login.dto';
import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ValidationLoginPipe implements PipeTransform<any> {
  async transform(value: LoginDto, { metatype }: ArgumentMetadata) {
    if (metatype === LoginDto) {
      if (this.isEmail(value.username) || this.isPhoneNumber(value.username)) {
        return value;
      }
    }
    throw new BadRequestException(
      'Invalid username. It should be either an email or a phone number.',
    );
  }

  private isEmail(email: string) {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  }

  private isPhoneNumber(phone: string) {
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  }
}
