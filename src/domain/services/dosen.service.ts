/*
https://docs.nestjs.com/providers#services
*/

import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DosenEntity } from '../entities/dosen.entity';
import { CreateDosen } from 'src/infra/models/dosen.model';
import { DosenDTO } from 'src/app/dtos/dosen.dto';

@Injectable()
export class DosenService {
  constructor(
    @Inject('DOSEN_REPOSITORY')
    private dosenRepository: Repository<DosenEntity>,
  ) { }

  async create(body: CreateDosen) {
    const existingDosen = await this.dosenRepository.findOne({
      where: { nidn: body.nidn },
    });
    if (existingDosen && existingDosen.is_active) {
      throw new HttpException('Dosen already exists', 409);
    } else if (existingDosen && !existingDosen.is_active) {
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
          throw new HttpException('Dosen already exists', 409);
        } else {
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

  async update(body: CreateDosen, nidn: string) {
    return this.dosenRepository
      .findOne({ where: { nidn: nidn } })
      .then(async (dosen) => {
        if (dosen) {
          const existingDosen = await this.dosenRepository.findOne({
            where: { nidn: body.nidn },
          });
          if (existingDosen && existingDosen.nidn !== nidn) {
            throw new HttpException(
              'Another dosen with the same name already exists',
              409,
            );
          } else {
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
          throw new HttpException('Dosen not found', 404);
        }
      });
  }

  async active(nidn: string) {
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
          return { message: 'Dosen activated successfully' };
        } else {
          throw new HttpException('Dosen not found', 404);
        }
      });
  }

  async deactive(nidn: string) {
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
          return { message: 'Dosen deactivated successfully' };
        } else {
          throw new HttpException('Dosen not found', 404);
        }
      });
  }

  async all(query: DosenDTO) {
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

  async findOne(nidn: string) {
    try {
      return this.dosenRepository
        .findOne({ where: { nidn: nidn } })
        .then((dosen) => {
          if (dosen) {
            let statusCode = 200;
            return { statusCode, data: dosen };
          } else {
            throw new HttpException('Data not found', 404);
          }
        });
    }
    catch (e) {
      console.log(e);
    }
  }

  async deleteByNidn(nidn: string) {
    const dosen = await this.dosenRepository.findOne({ where: { nidn: nidn } });
    if (!dosen) {
      throw new HttpException('Dosen not found', 404);
    }
    await this.dosenRepository.delete({ nidn: nidn });
    return { message: 'Dosen deleted successfully' };
  }
}
