import { ResultTechnicalTestEntity } from '@entities/technical-test-result/result-test.entity';
import { TestEntity } from '@entities/testing/tests.entity';
import { EntityTarget } from 'typeorm';

export type TestingEntityFields = EntityTarget<TestEntity>;
export type TechTestEntityFields = EntityTarget<ResultTechnicalTestEntity>;
