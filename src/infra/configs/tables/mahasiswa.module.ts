import { Module } from '@nestjs/common';
import { mahasiswaProvider } from './mahasiswa.provider';
import { DatabaseModule } from '../database.module';
import { MahasiswaService } from 'src/domain/services/mahasiswa.service';
@Module({
    imports: [DatabaseModule],
    providers: [
        ...mahasiswaProvider,
        MahasiswaService,
    ],
    exports: [...mahasiswaProvider],
})
export class MahasiswaModule { }