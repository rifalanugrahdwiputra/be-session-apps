import { UserEntity } from 'src/domain/entities/user.entity';
import { DataSource } from 'typeorm';


export const authProvider = [
  {
    provide: 'AUTH_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(UserEntity),
    inject: ['DATA_SOURCE'],
  },
];