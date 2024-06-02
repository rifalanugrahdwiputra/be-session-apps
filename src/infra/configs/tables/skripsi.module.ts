import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database.module';
import { skripsiProvider } from './skripsi.provider';
import { SkripsiService } from 'src/domain/services/skripsi.service';
@Module({
    imports: [DatabaseModule],
    providers: [
        ...skripsiProvider,
        SkripsiService,
    ],
    exports: [...skripsiProvider],
})
export class SkripsiModule { }