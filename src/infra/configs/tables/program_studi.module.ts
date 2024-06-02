import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database.module';
import { programStudiProvider } from './program_studi.provider';
import { ProgramStudiService } from 'src/domain/services/program_studi.service';
@Module({
  imports: [DatabaseModule],
  providers: [
    ...programStudiProvider,
    ProgramStudiService,
  ],
  exports: [...programStudiProvider],
})
export class ProgramStudiModule { }