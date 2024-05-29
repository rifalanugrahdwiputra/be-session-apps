import { Module } from '@nestjs/common';
import { JobsCategoryRepository } from '../repositories/jobs_categories.repository';
import { DatabaseShutdownProvider, databaseProviders } from './database.provider';


@Module({
  providers: [...databaseProviders, JobsCategoryRepository, DatabaseShutdownProvider],
  exports: [...databaseProviders],
})
export class DatabaseModule {}