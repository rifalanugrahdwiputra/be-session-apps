import { JobCategoryEntity } from 'src/domain/entities/jobCategories.entity';
import { DataSource } from 'typeorm';


export const jobCategoryProvider = [
  {
    provide: 'JOB_CATEGORY_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(JobCategoryEntity),
    inject: ['DATA_SOURCE'],
  },
];