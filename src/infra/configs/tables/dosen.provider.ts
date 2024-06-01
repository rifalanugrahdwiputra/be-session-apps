import { DosenEntity } from 'src/domain/entities/dosen.entity';
import { DataSource } from 'typeorm';


export const dosenProvider = [
  {
    provide: 'DOSEN_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(DosenEntity),
    inject: ['DATA_SOURCE'],
  },
];