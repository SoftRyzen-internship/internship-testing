import { Test, TestingModule } from '@nestjs/testing';
import { TechnicalTestResultService } from '../technical-test-result.service';

describe('TechnicalTestResultService', () => {
  let service: TechnicalTestResultService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TechnicalTestResultService],
    }).compile();

    service = module.get<TechnicalTestResultService>(
      TechnicalTestResultService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
