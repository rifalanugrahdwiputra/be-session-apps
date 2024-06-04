import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database.module';
import { programStudiProvider } from './program_studi.provider';
import { ProgramStudiService } from 'src/domain/services/program_studi.service';
import { logTwProvider } from './log_tw.provider';
import { LogTwService } from 'src/domain/services/log_tw.service';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [
    ...programStudiProvider,
    ProgramStudiService,
    ...logTwProvider,
    LogTwService,
  ],
  exports: [
    ...programStudiProvider,
    ...logTwProvider,],
})
export class ProgramStudiModule { }