import { ProgramStudiEntity } from 'src/domain/entities/program_studi.entity';
import { DataSource } from 'typeorm';


export const programStudiProvider = [
  {
    provide: 'PROGRAM_STUDI_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(ProgramStudiEntity),
    inject: ['DATA_SOURCE'],
  },
];