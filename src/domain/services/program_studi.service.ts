/*
https://docs.nestjs.com/providers#services
*/

import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DosenEntity } from '../entities/dosen.entity';
import { CreateDosen } from 'src/infra/models/dosen.model';
import { DosenDTO } from 'src/app/dtos/dosen.dto';
import { CreateProgramStudi } from 'src/infra/models/program_studi.model';
import { ProgramStudiDTO } from 'src/app/dtos/program_studi.dto';
import { ProgramStudiEntity } from '../entities/program_studi.entity';

@Injectable()
export class ProgramStudiService {
  constructor(
    @Inject('PROGRAM_STUDI_REPOSITORY')
    private programStudiRepository: Repository<ProgramStudiEntity>,
  ) { }

  async create(body: CreateProgramStudi) {
    const existingProgramStudi = await this.programStudiRepository.findOne({
      where: { kode: body.kode },
    });
    if (existingProgramStudi && existingProgramStudi.is_active) {
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
      return { message: 'Program Studi created successfully' };
    }
    return await this.programStudiRepository
      .findOne({ where: { kode: body.kode } })
      .then((programStudi) => {
        if (programStudi) {
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
          return { message: 'Program Studi created successfully' };
        }
      });
  }

  async update(body: CreateProgramStudi, kode: string) {
    return this.programStudiRepository
      .findOne({ where: { kode: kode } })
      .then(async (programStudi) => {
        if (programStudi) {
          const existingProgramStudi = await this.programStudiRepository.findOne({
            where: { kode: body.kode },
          });
          if (existingProgramStudi && existingProgramStudi.kode !== kode) {
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
            return { message: 'Program Studi updated successfully' };
          }
        } else {
          throw new HttpException('Program Studi not found', 404);
        }
      });
  }

  async active(kode: string) {
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
          return { message: 'Program Studi activated successfully' };
        } else {
          throw new HttpException('Program Studi not found', 404);
        }
      });
  }

  async deactive(kode: string) {
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
          return { message: 'Program Studi deactivated successfully' };
        } else {
          throw new HttpException('Program Studi not found', 404);
        }
      });
  }

  async all(query: ProgramStudiDTO) {
    try {
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

  async findOne(kode: string) {
    try {
      return this.programStudiRepository
        .findOne({ where: { kode: kode } })
        .then((programStudi) => {
          if (programStudi) {
            let statusCode = 200;
            return { statusCode, data: programStudi };
          } else {
            throw new HttpException('Data not found', 404);
          }
        });
    }
    catch (e) {
      console.log(e);
    }
  }

  async deleteByKode(kode: string) {
    const dosen = await this.programStudiRepository.findOne({ where: { kode: kode } });
    if (!dosen) {
      throw new HttpException('Dosen not found', 404);
    }
    await this.programStudiRepository.delete({ kode: kode });
    return { message: 'Program Studi deleted successfully' };
  }
}
