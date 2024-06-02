import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CustomLoggingMiddleware } from './app/middlewares/logging/customLogging.middleware';
import { DosenController } from './app/controllers/dosen.controller';
import { DosenService } from './domain/services/dosen.service';
import { DosenRepository } from './infra/repositories/dosen.repository';
import { DosenModule } from './infra/configs/tables/dosen.module';
import { MahasiswaModule } from './infra/configs/tables/mahasiswa.module';

const ENV = process.env.NODE_ENV || 'dev';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.dev.env',
    }),
    DosenModule,
    MahasiswaModule
  ],
  controllers: [DosenController],
  providers: [DosenService, DosenRepository],
  exports: [DosenRepository],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CustomLoggingMiddleware).forRoutes('*');
  }
}
