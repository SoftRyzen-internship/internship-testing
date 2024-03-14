import { Test, TestingModule } from '@nestjs/testing';
import { TechnicalTestController } from '../technical-test.controller';

describe('TechnicalTestController', () => {
  let controller: TechnicalTestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TechnicalTestController],
    }).compile();

    controller = module.get<TechnicalTestController>(TechnicalTestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
