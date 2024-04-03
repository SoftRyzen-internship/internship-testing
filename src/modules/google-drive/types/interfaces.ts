import { EntityTarget } from 'typeorm';

import { ResultTechnicalTestEntity } from '@entities/tech-test-results/tech-test-results.entity';
import { TestEntity } from '@entities/testing/testing.entity';

export type TestingEntityFields = EntityTarget<TestEntity>;
export type TechTestEntityFields = EntityTarget<ResultTechnicalTestEntity>;
