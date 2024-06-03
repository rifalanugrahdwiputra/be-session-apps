import { Module } from '@nestjs/common';
import { authProvider } from './auth.provider';
import { DatabaseModule } from '../../database.module';
import { AuthService } from 'src/domain/services/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from 'src/app/middlewares/guard/local-strategy';
@Module({
  imports: [
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [
    ...authProvider,
    AuthService,
    LocalStrategy,
  ],
  exports: [
    ...authProvider,
    PassportModule,
    JwtModule,
  ],
})
export class AuthModule { }