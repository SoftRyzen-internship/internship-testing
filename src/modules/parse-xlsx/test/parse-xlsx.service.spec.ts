import { Test, TestingModule } from '@nestjs/testing';
import { ParseXlsxService } from '../parse-xlsx.service';

describe('ParseXlsxService', () => {
  let service: ParseXlsxService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParseXlsxService],
    }).compile();

    service = module.get<ParseXlsxService>(ParseXlsxService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
