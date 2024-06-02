import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database.module';
import { UsersService } from 'src/domain/services/users.service';
import { usersProvider } from './users.provider';
@Module({
  imports: [DatabaseModule],
  providers: [
    ...usersProvider,
    UsersService,
  ],
  exports: [...usersProvider],
})
export class UsersModule { }