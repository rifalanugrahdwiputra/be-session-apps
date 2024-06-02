import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CustomLoggingMiddleware } from './app/middlewares/logging/customLogging.middleware';
import { DosenController } from './app/controllers/dosen.controller';
import { DosenService } from './domain/services/dosen.service';
import { DosenRepository } from './infra/repositories/dosen.repository';
import { DosenModule } from './infra/configs/tables/dosen.module';
import { LogTwModule } from './infra/configs/tables/logtw.module';
import { LogTwController } from './app/controllers/logtw.controller';
import { LogTwService } from './domain/services/logtw.service';
import { ProgramStudiModule } from './infra/configs/tables/program_studi.module';
import { ProgramStudiController } from './app/controllers/program_studi.controller';
import { ProgramStudiService } from './domain/services/program_studi.service';
import { MahasiswaModule } from './infra/configs/tables/mahasiswa.module';
import { MahasiswaController } from './app/controllers/mahasiswa.controller';
import { MahasiswaService } from './domain/services/mahasiswa.service';

const ENV = process.env.NODE_ENV || 'dev';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.dev.env',
    }),
    DosenModule,
    LogTwModule,
    ProgramStudiModule,
    MahasiswaModule
  ],
  controllers: [DosenController, LogTwController, ProgramStudiController, MahasiswaController],
  providers: [DosenService, DosenRepository, LogTwService, ProgramStudiService, MahasiswaService],
  exports: [DosenRepository],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CustomLoggingMiddleware).forRoutes('*');
  }
}
