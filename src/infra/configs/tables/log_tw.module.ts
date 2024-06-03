import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database.module';
import { logTwProvider } from './log_tw.provider';
import { LogTwService } from 'src/domain/services/log_tw.service';
@Module({
  imports: [DatabaseModule],
  providers: [
    ...logTwProvider,
    LogTwService,
  ],
  exports: [...logTwProvider],
})
export class LogTwModule { }