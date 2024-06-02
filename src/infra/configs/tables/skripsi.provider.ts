import { SkripsiEntity } from 'src/domain/entities/skripsi.entity';
import { DataSource } from 'typeorm';


export const skripsiProvider = [
    {
        provide: 'SKRIPSI_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(SkripsiEntity),
        inject: ['DATA_SOURCE'],
    },
];


