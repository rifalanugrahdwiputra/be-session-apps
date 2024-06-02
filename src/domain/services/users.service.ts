/*
https://docs.nestjs.com/providers#services
*/

import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { UsersModelUpdate } from 'src/infra/models/users.model';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_REPOSITORY')
    private usersRepository: Repository<UserEntity>,
  ) { }

  async update(body: UsersModelUpdate, username: string) {
    return this.usersRepository
      .findOne({ where: { username: username } })
      .then(async (users) => {
        if (users) {
          const existingUsers = await this.usersRepository.findOne({
            where: { username: body.username },
          });
          if (existingUsers && existingUsers.username !== username) {
            throw new HttpException(
              'Another users with the same name already exists',
              409,
            );
          } else {
            const hashedPassword = crypto.createHash('md5').update(body.password).digest('hex');
            await this.usersRepository
              .createQueryBuilder()
              .update(UserEntity)
              .set({
                username: body.username,
                password: hashedPassword,
                foto: body.foto,
              })
              .where('username = :username', { username: username })
              .execute();
            return { message: 'Users updated successfully' };
          }
        } else {
          throw new HttpException('Users not found', 404);
        }
      });
  }

  async findOne(username: string) {
    try {
      return this.usersRepository
        .findOne({ where: { username: username } })
        .then((users) => {
          if (users) {
            let statusCode = 200;
            return { statusCode, data: users };
          } else {
            throw new HttpException('Users not found', 404);
          }
        });
    }
    catch (e) {
      console.log(e);
    }
  }
}
