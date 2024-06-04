import { Module } from '@nestjs/common';
import { mahasiswaProvider } from './mahasiswa.provider';
import { DatabaseModule } from '../database.module';
import { MahasiswaService } from 'src/domain/services/mahasiswa.service';
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
        ...mahasiswaProvider,
        MahasiswaService,
        ...logTwProvider,
        LogTwService,
    ],
    exports: [
        ...mahasiswaProvider,
        ...logTwProvider,],
})
export class MahasiswaModule { }