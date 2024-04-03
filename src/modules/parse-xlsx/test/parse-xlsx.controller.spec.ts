import { Test, TestingModule } from '@nestjs/testing';
import { ParseXlsxController } from '../parse-xlsx.controller';

describe('ParseXlsxController', () => {
  let controller: ParseXlsxController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParseXlsxController],
    }).compile();

    controller = module.get<ParseXlsxController>(ParseXlsxController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
