import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database.module';
import { skripsiProvider } from './skripsi.provider';
import { SkripsiService } from 'src/domain/services/skripsi.service';
import { LogTwService } from 'src/domain/services/log_tw.service';
import { logTwProvider } from './log_tw.provider';
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
        ...skripsiProvider,
        SkripsiService,
        ...logTwProvider,
        LogTwService,
    ],
    exports: [
        ...skripsiProvider,
        ...logTwProvider,],
})
export class SkripsiModule { }