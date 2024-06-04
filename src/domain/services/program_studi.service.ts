/*
https://docs.nestjs.com/providers#services
*/

import { HttpException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateProgramStudi } from 'src/infra/models/program_studi.model';
import { ProgramStudiDTO } from 'src/app/dtos/program_studi.dto';
import { ProgramStudiEntity } from '../entities/program_studi.entity';
import { LogTwEntity } from '../entities/log_tw.entity';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';

@Injectable()
export class ProgramStudiService {
  constructor(
    @Inject('PROGRAM_STUDI_REPOSITORY')
    private programStudiRepository: Repository<ProgramStudiEntity>,
    @Inject('LOG_TW_REPOSITORY')
    private logTwRepository: Repository<LogTwEntity>,
    private jwtService: JwtService,
  ) { }

  async create(body: CreateProgramStudi, request: Request) {
    const token = this.extractTokenFromHeader(request.headers.authorization);
    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      const existingProgramStudi = await this.programStudiRepository.findOne({
        where: { kode: body.kode },
      });
      if (existingProgramStudi && existingProgramStudi.is_active) {
        await this.logTwRepository
          .createQueryBuilder()
          .insert()
          .into(LogTwEntity)
          .values({
            user: payload.username,
            ipaddress: payload.ip,
            information: `${payload.username} program studi sudah ada dan gagal menambahkan`,
          })
          .execute();
        throw new HttpException('Program Studi already exists', 409);
      } else if (existingProgramStudi && !existingProgramStudi.is_active) {
        await this.programStudiRepository
          .createQueryBuilder()
          .update(ProgramStudiEntity)
          .set({
            is_active: true,
          })
          .where('kode = :kode', { kode: existingProgramStudi.kode })
          .execute();
        await this.logTwRepository
          .createQueryBuilder()
          .insert()
          .into(LogTwEntity)
          .values({
            user: payload.username,
            ipaddress: payload.ip,
            information: `${payload.username} program studi berhasil ditambahkan`,
          })
          .execute();
        return { message: 'Program Studi created successfully' };
      }
      return await this.programStudiRepository
        .findOne({ where: { kode: body.kode } })
        .then((programStudi) => {
          if (programStudi) {
            this.logTwRepository
              .createQueryBuilder()
              .insert()
              .into(LogTwEntity)
              .values({
                user: payload.username,
                ipaddress: payload.ip,
                information: `${payload.username} program studi sudah ada dan gagal menambahkan`,
              })
              .execute();
            throw new HttpException('Program Studi already exists', 409);
          } else {
            this.programStudiRepository
              .createQueryBuilder()
              .insert()
              .into(ProgramStudiEntity)
              .values({
                is_active: true,
                kode: body.kode,
                program_studi: body.program_studi,
                kaprodi: body.kaprodi,
                nidn_kaprodi: body.nidn_kaprodi,
              })
              .execute();
            this.logTwRepository
              .createQueryBuilder()
              .insert()
              .into(LogTwEntity)
              .values({
                user: payload.username,
                ipaddress: payload.ip,
                information: `${payload.username} program studi berhasil ditambahkan`,
              })
              .execute();
            return { message: 'Program Studi created successfully' };
          }
        });
    }
    catch (error) {
      console.log(error);
    }
  }

  async update(body: CreateProgramStudi, kode: string, request: Request) {
    const token = this.extractTokenFromHeader(request.headers.authorization);
    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      return this.programStudiRepository
        .findOne({ where: { kode: kode } })
        .then(async (programStudi) => {
          if (programStudi) {
            const existingProgramStudi = await this.programStudiRepository.findOne({
              where: { kode: body.kode },
            });
            if (existingProgramStudi && existingProgramStudi.kode !== kode) {
              await this.logTwRepository
                .createQueryBuilder()
                .insert()
                .into(LogTwEntity)
                .values({
                  user: payload.username,
                  ipaddress: payload.ip,
                  information: `${payload.username} program studi sudah ada dan gagal update`,
                })
                .execute();
              throw new HttpException(
                'Another program studi with the same name already exists',
                409,
              );
            } else {
              await this.programStudiRepository
                .createQueryBuilder()
                .update(ProgramStudiEntity)
                .set({
                  kode: body.kode,
                  program_studi: body.program_studi,
                  kaprodi: body.kaprodi,
                  nidn_kaprodi: body.nidn_kaprodi,
                })
                .where('kode = :kode', { kode: kode })
                .execute();
              await this.logTwRepository
                .createQueryBuilder()
                .insert()
                .into(LogTwEntity)
                .values({
                  user: payload.username,
                  ipaddress: payload.ip,
                  information: `${payload.username} program studi berhasil di update`,
                })
                .execute();
              return { message: 'Program Studi updated successfully' };
            }
          } else {
            await this.logTwRepository
              .createQueryBuilder()
              .insert()
              .into(LogTwEntity)
              .values({
                user: payload.username,
                ipaddress: payload.ip,
                information: `${payload.username} program studi tidak ditemukan`,
              })
              .execute();
            throw new HttpException('Program Studi not found', 404);
          }
        });
    }
    catch (error) {
      console.log(error);
    }
  }

  async active(kode: string, request: Request) {
    const token = this.extractTokenFromHeader(request.headers.authorization);
    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      return this.programStudiRepository
        .findOne({ where: { kode: kode } })
        .then((programStudi) => {
          if (programStudi) {
            this.programStudiRepository
              .createQueryBuilder()
              .update(ProgramStudiEntity)
              .set({
                is_active: true,
              })
              .where('kode = :kode', { kode: kode })
              .execute();
            this.logTwRepository
              .createQueryBuilder()
              .insert()
              .into(LogTwEntity)
              .values({
                user: payload.username,
                ipaddress: payload.ip,
                information: `${payload.username} program studi activated successfully`,
              })
              .execute();
            return { message: 'Program Studi activated successfully' };
          } else {
            this.logTwRepository
              .createQueryBuilder()
              .insert()
              .into(LogTwEntity)
              .values({
                user: payload.username,
                ipaddress: payload.ip,
                information: `${payload.username} program studi tidak ditemukan`,
              })
              .execute();
            throw new HttpException('Program Studi not found', 404);
          }
        });
    }
    catch (error) {
      console.log(error);
    }
  }

  async deactive(kode: string, request: Request) {
    const token = this.extractTokenFromHeader(request.headers.authorization);
    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      return this.programStudiRepository
        .findOne({ where: { kode: kode } })
        .then((programStudi) => {
          if (programStudi) {
            this.programStudiRepository
              .createQueryBuilder()
              .update(ProgramStudiEntity)
              .set({
                is_active: false,
              })
              .where('kode = :kode', { kode: kode })
              .execute();
            this.logTwRepository
              .createQueryBuilder()
              .insert()
              .into(LogTwEntity)
              .values({
                user: payload.username,
                ipaddress: payload.ip,
                information: `${payload.username} program studi deactivated successfully`,
              })
              .execute();
            return { message: 'Program Studi deactivated successfully' };
          } else {
            this.logTwRepository
              .createQueryBuilder()
              .insert()
              .into(LogTwEntity)
              .values({
                user: payload.username,
                ipaddress: payload.ip,
                information: `${payload.username} program studi tidak ditemukan`,
              })
              .execute();
            throw new HttpException('Program Studi not found', 404);
          }
        });
    }
    catch (error) {
      console.log(error);
    }
  }

  async all(query: ProgramStudiDTO, request: Request) {
    const token = this.extractTokenFromHeader(request.headers.authorization);
    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      try {
        await this.logTwRepository
          .createQueryBuilder()
          .insert()
          .into(LogTwEntity)
          .values({
            user: payload.username,
            ipaddress: payload.ip,
            information: `${payload.username} melihat list program studi`,
          })
          .execute();
        let includeInactive = query.include_inactive;
        if (includeInactive != 'false' && includeInactive != 'true') {
          throw new HttpException('Invalid value for include_inactive', 400);
        }
        let page = query.page;
        let limit = query.limit;
        let whereActive = `is_active ${includeInactive == 'true' ? 'IS NOT NULL' : '= 1'} `;
        let sortBy = query.sortBy;
        let orderBy = query.orderBy;
        if (query.program_studi) {
          const result = await this.programStudiRepository
            .createQueryBuilder()
            .select()
            .where('program_studi LIKE :program_studi', {
              program_studi: `%${query.program_studi}%`,
            })
            .andWhere(whereActive)
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
          const result = await this.programStudiRepository
            .createQueryBuilder()
            .select()
            .where(whereActive)
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
    catch (error) {
      console.log(error);
    }
  }

  async findOne(kode: string, request: Request) {
    const token = this.extractTokenFromHeader(request.headers.authorization);
    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      try {
        return this.programStudiRepository
          .findOne({ where: { kode: kode } })
          .then((programStudi) => {
            if (programStudi) {
              this.logTwRepository
                .createQueryBuilder()
                .insert()
                .into(LogTwEntity)
                .values({
                  user: payload.username,
                  ipaddress: payload.ip,
                  information: `${payload.username} melihat detail program studi`,
                })
                .execute();
              let statusCode = 200;
              return { statusCode, data: programStudi };
            } else {
              this.logTwRepository
                .createQueryBuilder()
                .insert()
                .into(LogTwEntity)
                .values({
                  user: payload.username,
                  ipaddress: payload.ip,
                  information: `${payload.username} program studi tidak ditemukan`,
                })
                .execute();
              throw new HttpException('Data not found', 404);
            }
          });
      }
      catch (e) {
        console.log(e);
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  async deleteByKode(kode: string, request: Request) {
    const token = this.extractTokenFromHeader(request.headers.authorization);
    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      const programStudi = await this.programStudiRepository.findOne({ where: { kode: kode } });
      if (!programStudi) {
        await this.logTwRepository
          .createQueryBuilder()
          .insert()
          .into(LogTwEntity)
          .values({
            user: payload.username,
            ipaddress: payload.ip,
            information: `${payload.username} program studi tidak ditemukan`,
          })
          .execute();
        throw new HttpException('Program Studi not found', 404);
      }
      await this.programStudiRepository.delete({ kode: kode });
      await this.logTwRepository
        .createQueryBuilder()
        .insert()
        .into(LogTwEntity)
        .values({
          user: payload.username,
          ipaddress: payload.ip,
          information: `${payload.username} program studi berhasil di delete`,
        })
      return { message: 'Program Studi deleted successfully' };
    }
    catch (error) {
      console.log(error);
    }
  }

  private extractTokenFromHeader(authHeader: string | undefined): string | undefined {
    const [type, token] = authHeader?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
