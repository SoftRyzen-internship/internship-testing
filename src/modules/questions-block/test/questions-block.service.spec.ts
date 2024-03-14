import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsBlockService } from '../questions-block.service';

describe('QuestionsBlockService', () => {
  let service: QuestionsBlockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuestionsBlockService],
    }).compile();

    service = module.get<QuestionsBlockService>(QuestionsBlockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
