import { Module } from '@nestjs/common';
import { QuestionsBlockController } from './questions-block.controller';
import { QuestionsBlockService } from './questions-block.service';

@Module({
  controllers: [QuestionsBlockController],
  providers: [QuestionsBlockService]
})
export class QuestionsBlockModule {}
