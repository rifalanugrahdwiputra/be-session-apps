import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database.module';
import { UsersService } from 'src/domain/services/users.service';
import { usersProvider } from './users.provider';
import { LogTwService } from 'src/domain/services/log_tw.service';
import { logTwProvider } from './log_tw.provider';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),],
  providers: [
    ...usersProvider,
    UsersService,
    ...logTwProvider,
    LogTwService,
  ],
  exports: [
    ...usersProvider,
    ...logTwProvider,
  ],
})
export class UsersModule { }