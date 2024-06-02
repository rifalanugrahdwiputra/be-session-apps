import { MahasiswaEntity } from 'src/domain/entities/mahasiswa.entity';
import { DataSource } from 'typeorm';


export const mahasiswaProvider = [
    {
        provide: 'MAHASISWA_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(MahasiswaEntity),
        inject: ['DATA_SOURCE'],
    },
];