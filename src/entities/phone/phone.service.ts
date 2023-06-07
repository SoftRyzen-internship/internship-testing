import { ConflictException, Injectable } from '@nestjs/common';

@Injectable()
export class PhoneService {
  // !
  //  Поправлю после создания модели юзера
  private readonly userService: any;
  constructor() {}

  async checkPhone(phone: string) {
    const user = await this.userService.getUser(phone);
    if (user) {
      throw new ConflictException('Phone number already exists');
    }
    return 'OK';
  }
}
