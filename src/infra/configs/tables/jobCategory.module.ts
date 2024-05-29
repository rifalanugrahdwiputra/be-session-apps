import { Module } from '@nestjs/common';
import { jobCategoryProvider } from './jobCategory.provider';
import { DatabaseModule } from '../database.module';
import { JobsCategoriesService } from 'src/domain/services/jobsCategories.service';
@Module({
  imports: [DatabaseModule],
  providers: [
    ...jobCategoryProvider,
    JobsCategoriesService,
  ],
  exports: [...jobCategoryProvider],
})
export class JobCategoryModule { }