import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CustomLoggingMiddleware } from './app/middlewares/logging/customLogging.middleware';
import { DosenController } from './app/controllers/dosen.controller';
import { DosenService } from './domain/services/dosen.service';
import { DosenRepository } from './infra/repositories/dosen.repository';
import { DosenModule } from './infra/configs/tables/dosen.module';
import { LogTwModule } from './infra/configs/tables/log_tw.module';
import { LogTwController } from './app/controllers/log_tw.controller';
import { LogTwService } from './domain/services/log_tw.service';
import { ProgramStudiModule } from './infra/configs/tables/program_studi.module';
import { ProgramStudiController } from './app/controllers/program_studi.controller';
import { ProgramStudiService } from './domain/services/program_studi.service';
import { MahasiswaModule } from './infra/configs/tables/mahasiswa.module';
import { MahasiswaController } from './app/controllers/mahasiswa.controller';
import { MahasiswaService } from './domain/services/mahasiswa.service';
import { SkripsiModule } from './infra/configs/tables/skripsi.module';
import { SkripsiController } from './app/controllers/skripsi.controller';
import { SkripsiService } from './domain/services/skripsi.service';
import { AuthModule } from './infra/configs/tables/auth/auth.module';
import { AuthController } from './app/controllers/auth/auth.controller';
import { AuthService } from './domain/services/auth.service';
import { UsersModule } from './infra/configs/tables/users.module';
import { UsersController } from './app/controllers/users.controller';
import { UsersService } from './domain/services/users.service';
import { DashboardModule } from './infra/configs/tables/dashboard.module';
import { DashboardController } from './app/controllers/dashboard.controller';
import { DashboardService } from './domain/services/dashboard.service';
import { UtilController } from './app/controllers/util.controller';
import { UtilsService } from './domain/services/util.service';

const ENV = process.env.NODE_ENV || 'dev';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.dev.env',
    }),
    AuthModule,
    UsersModule,
    DashboardModule,
    DosenModule,
    LogTwModule,
    ProgramStudiModule,
    MahasiswaModule,
    SkripsiModule,
  ],
  controllers: [AuthController, UsersController, DashboardController, UtilController, DosenController, LogTwController, ProgramStudiController, MahasiswaController, SkripsiController],
  providers: [AuthService, UsersService, DashboardService, UtilsService, DosenService, DosenRepository, LogTwService, ProgramStudiService, MahasiswaService, SkripsiService],
  exports: [DosenRepository],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CustomLoggingMiddleware).forRoutes('*');
  }
}
