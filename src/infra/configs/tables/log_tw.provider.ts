
import { LogTwEntity } from 'src/domain/entities/log_tw.entity';
import { DataSource } from 'typeorm';


export const logTwProvider = [
  {
    provide: 'LOG_TW_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(LogTwEntity),
    inject: ['DATA_SOURCE'],
  },
];