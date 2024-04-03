import { Test, TestingModule } from '@nestjs/testing';
import { TechnicalTestService } from '../technical-test.service';

describe('TechnicalTestService', () => {
  let service: TechnicalTestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TechnicalTestService],
    }).compile();

    service = module.get<TechnicalTestService>(TechnicalTestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
