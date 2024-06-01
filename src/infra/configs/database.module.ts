import { Module } from '@nestjs/common';
import { DatabaseShutdownProvider, databaseProviders } from './database.provider';
import { DosenRepository } from '../repositories/dosen.repository';


@Module({
  providers: [...databaseProviders, DosenRepository, DatabaseShutdownProvider],
  exports: [...databaseProviders],
})
export class DatabaseModule { }