import { Module } from '@nestjs/common';
import { dosenProvider } from './dosen.provider';
import { DatabaseModule } from '../database.module';
import { DosenService } from 'src/domain/services/dosen.service';
@Module({
  imports: [DatabaseModule],
  providers: [
    ...dosenProvider,
    DosenService,
  ],
  exports: [...dosenProvider],
})
export class DosenModule { }