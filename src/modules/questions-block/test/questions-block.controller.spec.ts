import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsBlockController } from '../questions-block.controller';

describe('QuestionsBlockController', () => {
  let controller: QuestionsBlockController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionsBlockController],
    }).compile();

    controller = module.get<QuestionsBlockController>(QuestionsBlockController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
