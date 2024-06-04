import { HttpException, Inject, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { UsersModelUpdate } from 'src/infra/models/users.model';
import { LogTwEntity } from '../entities/log_tw.entity';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_REPOSITORY')
    private usersRepository: Repository<UserEntity>,
    @Inject('LOG_TW_REPOSITORY')
    private logTwRepository: Repository<LogTwEntity>,
    private jwtService: JwtService,
  ) { }

  async update(body: UsersModelUpdate, request: Request) {
    const token = this.extractTokenFromHeader(request.headers.authorization);
    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      return this.usersRepository
        .findOne({ where: { username: payload.username } })
        .then(async (users) => {
          if (users) {
            const existingUsers = await this.usersRepository.findOne({
              where: { username: body.username },
            });
            if (existingUsers) {
              await this.logTwRepository
                .createQueryBuilder()
                .insert()
                .into(LogTwEntity)
                .values({
                  user: body.username,
                  ipaddress: payload.ip,
                  information: `${body.username} users sudah ada dan gagal update`,
                })
                .execute();
              throw new HttpException(
                'Another users with the same name already exists',
                409,
              );
            } else {
              await this.usersRepository
                .createQueryBuilder()
                .update(UserEntity)
                .set({
                  username: body.username,
                  email: body.email,
                  alamat: body.alamat,
                  telp: body.telp,
                  is_active: true,
                })
                .where('username = :username', { username: payload.username })
                .execute();
              await this.logTwRepository
                .createQueryBuilder()
                .insert()
                .into(LogTwEntity)
                .values({
                  user: body.username,
                  ipaddress: payload.ip,
                  information: `${body.username} berhasil mengupdate users`,
                })
                .execute();
              return { message: 'Users updated successfully' };
            }
          } else {
            await this.logTwRepository
              .createQueryBuilder()
              .insert()
              .into(LogTwEntity)
              .values({
                user: body.username,
                ipaddress: payload.ip,
                information: `${body.username} gagal menemukan users`,
              })
              .execute();
            throw new HttpException('Users not found', 404);
          }
        },
        );
    }
    catch (e) {
      throw new ForbiddenException('Invalid token');
    }
  }

  async findOne(request: Request) {
    const token = this.extractTokenFromHeader(request.headers.authorization);
    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      console.log(payload)
      const user = await this.usersRepository.findOne({ where: { username: payload.username } });
      if (user) {
        await this.logTwRepository
          .createQueryBuilder()
          .insert()
          .into(LogTwEntity)
          .values({
            user: payload.username,
            ipaddress: process.env.DB_HOST,
            information: `${payload.username} berhasil menemukan users`,
          })
          .execute();
        return { statusCode: 200, data: user };
      } else {
        await this.logTwRepository
          .createQueryBuilder()
          .insert()
          .into(LogTwEntity)
          .values({
            user: payload.username,
            ipaddress: process.env.DB_HOST,
            information: `${payload.username} gagal menemukan users`,
          })
          .execute();
        throw new HttpException('User not found', 404);
      }
    } catch (e) {
      throw new ForbiddenException('Invalid token');
    }
  }

  private extractTokenFromHeader(authHeader: string | undefined): string | undefined {
    const [type, token] = authHeader?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
