import { Test, TestingModule } from '@nestjs/testing';
import { TechnicalTestResultController } from '../technical-test-result.controller';

describe('TechnicalTestResultController', () => {
  let controller: TechnicalTestResultController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TechnicalTestResultController],
    }).compile();

    controller = module.get<TechnicalTestResultController>(
      TechnicalTestResultController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
