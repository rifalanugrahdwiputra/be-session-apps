import { Module } from '@nestjs/common';
import { dosenProvider } from './dosen.provider';
import { DatabaseModule } from '../database.module';
import { DosenService } from 'src/domain/services/dosen.service';
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
    ...dosenProvider,
    DosenService,
    ...logTwProvider,
    LogTwService,
  ],
  exports: [
    ...dosenProvider,
    ...logTwProvider],
})
export class DosenModule { }