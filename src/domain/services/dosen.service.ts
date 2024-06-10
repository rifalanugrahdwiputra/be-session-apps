/*
https://docs.nestjs.com/providers#services
*/

import { HttpException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DosenEntity } from '../entities/dosen.entity';
import { CreateDosen } from 'src/infra/models/dosen.model';
import { DosenDTO } from 'src/app/dtos/dosen.dto';
import { LogTwEntity } from '../entities/log_tw.entity';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { Request } from 'express';

@Injectable()
export class DosenService {
  constructor(
    @Inject('DOSEN_REPOSITORY')
    private dosenRepository: Repository<DosenEntity>,
    @Inject('LOG_TW_REPOSITORY')
    private logTwRepository: Repository<LogTwEntity>,
    private jwtService: JwtService,
  ) { }

  async create(body: CreateDosen, request: Request) {
    const token = this.extractTokenFromHeader(request.headers.authorization);
    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      const existingDosen = await this.dosenRepository.findOne({
        where: { nidn: body.nidn },
      });
      if (existingDosen && existingDosen.is_active) {
        await this.logTwRepository
          .createQueryBuilder()
          .insert()
          .into(LogTwEntity)
          .values({
            user: payload.username,
            ipaddress: payload.ip,
            information: `${payload.username} dosen sudah ada dan gagal update`,
          })
          .execute();
        throw new HttpException('Dosen already exists', 409);
      } else if (existingDosen && !existingDosen.is_active) {
        await this.logTwRepository
          .createQueryBuilder()
          .insert()
          .into(LogTwEntity)
          .values({
            user: payload.username,
            ipaddress: payload.ip,
            information: `${payload.username} dosen berhasil di tambahkan`,
          })
          .execute();
        await this.dosenRepository
          .createQueryBuilder()
          .update(DosenEntity)
          .set({
            is_active: true,
          })
          .where('nidn = :nidn', { nidn: existingDosen.nidn })
          .execute();
        return { message: 'Dosen created successfully' };
      }
      return await this.dosenRepository
        .findOne({ where: { nidn: body.nidn } })
        .then((dosen) => {
          if (dosen) {
            this.logTwRepository
              .createQueryBuilder()
              .insert()
              .into(LogTwEntity)
              .values({
                user: payload.username,
                ipaddress: payload.ip,
                information: `${payload.username} dosen sudah ada dan gagal update`,
              })
              .execute();
            throw new HttpException('Dosen already exists', 409);
          } else {
            this.logTwRepository
              .createQueryBuilder()
              .insert()
              .into(LogTwEntity)
              .values({
                user: payload.username,
                ipaddress: payload.ip,
                information: `${payload.username} dosen berhasil di tambahkan`,
              })
              .execute();
            this.dosenRepository
              .createQueryBuilder()
              .insert()
              .into(DosenEntity)
              .values({
                is_active: true,
                nidn: body.nidn,
                nama: body.nama,
                foto: body.foto,
              })
              .execute();
            return { message: 'Dosen created successfully' };
          }
        });
    }
    catch (error) { }
  }

  async update(body: CreateDosen, nidn: string, request: Request) {
    const token = this.extractTokenFromHeader(request.headers.authorization);
    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      return this.dosenRepository
        .findOne({ where: { nidn: nidn } })
        .then(async (dosen) => {
          if (dosen) {
            const existingDosen = await this.dosenRepository.findOne({
              where: { nidn: body.nidn },
            });
            if (existingDosen && existingDosen.nidn !== nidn) {
              await this.logTwRepository
                .createQueryBuilder()
                .insert()
                .into(LogTwEntity)
                .values({
                  user: payload.username,
                  ipaddress: payload.ip,
                  information: `${payload.username} dosen sudah ada dan gagal update`,
                })
                .execute();
              throw new HttpException(
                'Another dosen with the same name already exists',
                409,
              );
            } else {
              await this.logTwRepository
                .createQueryBuilder()
                .insert()
                .into(LogTwEntity)
                .values({
                  user: payload.username,
                  ipaddress: payload.ip,
                  information: `${payload.username} dosen berhasil update`,
                })
                .execute();
              await this.dosenRepository
                .createQueryBuilder()
                .update(DosenEntity)
                .set({
                  nidn: body.nidn,
                  nama: body.nama,
                  foto: body.foto,
                })
                .where('nidn = :nidn', { nidn: nidn })
                .execute();
              return { message: 'Dosen updated successfully' };
            }
          } else {
            this.logTwRepository
              .createQueryBuilder()
              .insert()
              .into(LogTwEntity)
              .values({
                user: payload.username,
                ipaddress: payload.ip,
                information: `${payload.username} dosen tidak ditemukan`,
              })
              .execute();
            throw new HttpException('Dosen not found', 404);
          }
        });
    }
    catch (error) { }
  }

  async active(nidn: string, request: Request) {
    const token = this.extractTokenFromHeader(request.headers.authorization);
    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      return this.dosenRepository
        .findOne({ where: { nidn: nidn } })
        .then((dosen) => {
          if (dosen) {
            this.dosenRepository
              .createQueryBuilder()
              .update(DosenEntity)
              .set({
                is_active: true,
              })
              .where('nidn = :nidn', { nidn: nidn })
              .execute();
            this.logTwRepository
              .createQueryBuilder()
              .insert()
              .into(LogTwEntity)
              .values({
                user: payload.username,
                ipaddress: payload.ip,
                information: `${payload.username} dosen berhasil di aktifkan`,
              })
              .execute();
            return { message: 'Dosen activated successfully' };
          } else {
            this.logTwRepository
              .createQueryBuilder()
              .insert()
              .into(LogTwEntity)
              .values({
                user: payload.username,
                ipaddress: payload.ip,
                information: `${payload.username} dosen tidak ditemukan`,
              })
              .execute();
            throw new HttpException('Dosen not found', 404);
          }
        });
    } catch (error) {
      console.log(error);
    }
  }

  async deactive(nidn: string, request: Request) {
    const token = this.extractTokenFromHeader(request.headers.authorization);
    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      return this.dosenRepository
        .findOne({ where: { nidn: nidn } })
        .then((dosen) => {
          if (dosen) {
            this.dosenRepository
              .createQueryBuilder()
              .update(DosenEntity)
              .set({
                is_active: false,
              })
              .where('nidn = :nidn', { nidn: nidn })
              .execute();
            this.logTwRepository
              .createQueryBuilder()
              .insert()
              .into(LogTwEntity)
              .values({
                user: payload.username,
                ipaddress: payload.ip,
                information: `${payload.username} dosen deactivated successfully`,
              })
              .execute();
            return { message: 'Dosen deactivated successfully' };
          } else {
            this.logTwRepository
              .createQueryBuilder()
              .insert()
              .into(LogTwEntity)
              .values({
                user: payload.username,
                ipaddress: payload.ip,
                information: `${payload.username} dosen not found`,
              })
              .execute();
            throw new HttpException('Dosen not found', 404);
          }
        });
    }
    catch (error) {
      console.log(error);
    }
  }

  async all(query: DosenDTO, request: Request) {
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
            information: `${payload.username} melihat list dosen`,
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
        if (query.nama) {
          const result = await this.dosenRepository
            .createQueryBuilder()
            .select()
            .where('nama LIKE :nama', {
              nama: `%${query.nama}%`,
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
          const result = await this.dosenRepository
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

  async findOne(nidn: string, request: Request) {
    const token = this.extractTokenFromHeader(request.headers.authorization);
    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      try {
        return this.dosenRepository
          .findOne({ where: { nidn: nidn } })
          .then((dosen) => {
            if (dosen) {
              this.logTwRepository
                .createQueryBuilder()
                .insert()
                .into(LogTwEntity)
                .values({
                  user: payload.username,
                  ipaddress: payload.ip,
                  information: `${payload.username} dosen not found`,
                })
                .execute(); this.logTwRepository
                  .createQueryBuilder()
                  .insert()
                  .into(LogTwEntity)
                  .values({
                    user: payload.username,
                    ipaddress: payload.ip,
                    information: `${payload.username} melihat detail dosen`,
                  })
                  .execute();
              let statusCode = 200;
              return { statusCode, data: dosen };
            } else {
              this.logTwRepository
                .createQueryBuilder()
                .insert()
                .into(LogTwEntity)
                .values({
                  user: payload.username,
                  ipaddress: payload.ip,
                  information: `${payload.username} dosen not found`,
                })
                .execute(); this.logTwRepository
                  .createQueryBuilder()
                  .insert()
                  .into(LogTwEntity)
                  .values({
                    user: payload.username,
                    ipaddress: payload.ip,
                    information: `${payload.username} dosen not found`,
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

  async deleteByNidn(nidn: string, request: Request) {
    const token = this.extractTokenFromHeader(request.headers.authorization);
    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      const dosen = await this.dosenRepository.findOne({ where: { nidn: nidn } });
      if (!dosen) {
        await this.logTwRepository
          .createQueryBuilder()
          .insert()
          .into(LogTwEntity)
          .values({
            user: payload.username,
            ipaddress: payload.ip,
            information: `${payload.username} dosen not found`,
          })
          .execute();
        throw new HttpException('Dosen not found', 404);
      }
      await this.dosenRepository.delete({ nidn: nidn });
      await this.logTwRepository
        .createQueryBuilder()
        .insert()
        .into(LogTwEntity)
        .values({
          user: payload.username,
          ipaddress: payload.ip,
          information: `${payload.username} dosen berhasil di delete`,
        })
        .execute();
      return { message: 'Dosen deleted successfully' };
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
