import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
dotenv.config();

export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: ['dist/src/entities/**/*.entity.js'],
  migrations: ['dist/src/migrations/**/*.js'],
  migrationsTableName: 'migrations',
});
