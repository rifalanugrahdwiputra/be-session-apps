import { Module } from '@nestjs/common';
import { dosenProvider } from './dosen.provider';
import { DatabaseModule } from '../database.module';
import { DosenService } from 'src/domain/services/dosen.service';
import { logTwProvider } from './log_tw.provider';
import { LogTwService } from 'src/domain/services/log_tw.service';
import { MahasiswaService } from 'src/domain/services/mahasiswa.service';
import { ProgramStudiService } from 'src/domain/services/program_studi.service';
import { SkripsiService } from 'src/domain/services/skripsi.service';
import { mahasiswaProvider } from './mahasiswa.provider';
import { programStudiProvider } from './program_studi.provider';
import { skripsiProvider } from './skripsi.provider';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),],
  providers: [
    ...dosenProvider,
    DosenService,
    ...logTwProvider,
    LogTwService,
    ...mahasiswaProvider,
    MahasiswaService,
    ...programStudiProvider,
    ProgramStudiService,
    ...skripsiProvider,
    SkripsiService,

  ],
  exports: [
    ...dosenProvider,
    ...mahasiswaProvider,
    ...programStudiProvider,
    ...skripsiProvider,
    ...logTwProvider,
  ],
})
export class DashboardModule { }