/*
https://docs.nestjs.com/providers#services
*/

import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { LogTwEntity } from '../entities/log_tw.entity';
import { CreateLogTw } from 'src/infra/models/log_tw.model';
import { LogTwDTO } from 'src/app/dtos/log_tw.dto';

@Injectable()
export class LogTwService {
  constructor(
    @Inject('LOG_TW_REPOSITORY')
    private logTwRepository: Repository<LogTwEntity>,
  ) { }

  async create(body: CreateLogTw) {
    await this.logTwRepository
      .createQueryBuilder()
      .insert()
      .into(LogTwEntity)
      .values({
        user: body.user,
        ipaddress: body.ipaddress,
        information: body.information,
      })
      .execute();
    return { message: 'LogTw created successfully' };
  }

  async update(body: CreateLogTw, id: number) {
    return this.logTwRepository
      .findOne({ where: { id: id } })
      .then(async (logTw) => {
        if (logTw) {
          await this.logTwRepository
            .createQueryBuilder()
            .update(LogTwEntity)
            .set({
              user: body.user,
              ipaddress: body.ipaddress,
              information: body.information,
            })
            .where('id = :id', { id: id })
            .execute();
          return { message: 'Log Tw updated successfully' };
        } else {
          throw new HttpException('Log Tw not found', 404);
        }
      });
  }

  async all(query: LogTwDTO) {
    try {
      let page = query.page;
      let limit = query.limit;
      let sortBy = query.sortBy;
      let orderBy = query.orderBy;
      if (query.user) {
        const result = await this.logTwRepository
          .createQueryBuilder()
          .select()
          .where('user LIKE :user', {
            user: `%${query.user}%`,
          })
          .orderBy(sortBy, orderBy)
          .skip((page - 1) * limit)
          .take(limit)
          .getManyAndCount();

        let count = result[1];
        let data = [];
        result[0].map((item) => {
          data.push({
            ...item,
          });
        });

        let statusCode = 200;
        return { statusCode, data, count };
      } else {
        const result = await this.logTwRepository
          .createQueryBuilder()
          .select()
          .orderBy(sortBy, orderBy)
          .skip((page - 1) * limit)
          .take(limit)
          .getManyAndCount();
        let count = result[1];
        let data = [];
        result[0].map((item) => {
          data.push({
            ...item,
          });
        });
        let statusCode = 200;
        return { statusCode, data, count };
      }
    }
    catch (e) {
      console.log(e)
    }
  }

  async findOne(id: number) {
    try {
      return this.logTwRepository
        .findOne({ where: { id: id } })
        .then((logTw) => {
          if (logTw) {
            let statusCode = 200;
            return { statusCode, data: logTw };
          } else {
            throw new HttpException('Data not found', 404);
          }
        });
    }
    catch (e) {
      console.log(e);
    }
  }

  async deleteById(id: number) {
    const logTw = await this.logTwRepository.findOne({ where: { id: id } });
    if (!logTw) {
      throw new HttpException('Log Tw not found', 404);
    }
    await this.logTwRepository.delete({ id: id });
    return { message: 'Log Tw deleted successfully' };
  }
}
