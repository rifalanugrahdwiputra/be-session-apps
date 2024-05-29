import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CustomLoggingMiddleware } from './app/middlewares/logging/customLogging.middleware';
import { JobCategoryModule } from './infra/configs/tables/jobCategory.module';
import { Jobs_categoriesController } from './app/controllers/jobsCategories.controller';
import { JobsCategoriesService } from './domain/services/jobsCategories.service';
import { JobsCategoryRepository } from './infra/repositories/jobs_categories.repository';

const ENV = process.env.NODE_ENV || 'dev';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.dev.env',
    }),
    JobCategoryModule
  ],
  controllers: [Jobs_categoriesController],
  providers: [JobsCategoriesService, JobsCategoryRepository],
  exports: [JobsCategoryRepository],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CustomLoggingMiddleware).forRoutes('*');
  }
}
