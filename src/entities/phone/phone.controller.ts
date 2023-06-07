import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PhoneDto } from './dto/phone.dto';
import { PhoneService } from './phone.service';

@ApiTags('Phone unique')
@Controller('api/phone')
export class PhoneController {
  constructor(private readonly phoneService: PhoneService) {}

  @ApiResponse({ status: 200, type: String, description: 'OK' })
  @Post('check')
  async checkPhone(@Body() body: PhoneDto) {
    return this.phoneService.checkPhone(body.phone);
  }
}
