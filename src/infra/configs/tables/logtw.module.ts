import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database.module';
import { logTwProvider } from './logtw.provider';
import { LogTwService } from 'src/domain/services/logtw.service';
@Module({
  imports: [DatabaseModule],
  providers: [
    ...logTwProvider,
    LogTwService,
  ],
  exports: [...logTwProvider],
})
export class LogTwModule { }