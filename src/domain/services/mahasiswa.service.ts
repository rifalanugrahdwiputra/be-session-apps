import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MahasiswaEntity } from '../entities/mahasiswa.entity';
import { CreateMahasiswa } from 'src/infra/models/mahasiswa.model';
import { MahasiswaDTO } from 'src/app/dtos/mahasiswa.dto';

@Injectable()
export class MahasiswaService {
    constructor(
        @Inject('MAHASISWA_REPOSITORY')
        private mahasiswaRepository: Repository<MahasiswaEntity>,
    ) { }

    async create(body: CreateMahasiswa) {
        const existingMahasiswa = await this.mahasiswaRepository.findOne({
            where: { nim: body.nim },
        });
        if (existingMahasiswa && existingMahasiswa.is_active) {
            throw new HttpException('Mahasiswa already exists', 409);
        } else if (existingMahasiswa && !existingMahasiswa.is_active) {
            await this.mahasiswaRepository
                .createQueryBuilder()
                .update(MahasiswaEntity)
                .set({
                    is_active: true,
                })
                .where('nim = :nim', { nim: existingMahasiswa.nim })
                .execute();
            return { message: 'Mahasiswa created successfully' };
        }
        return await this.mahasiswaRepository
            .findOne({ where: { nim: body.nim } })
            .then((mahasiswa) => {
                if (mahasiswa) {
                    throw new HttpException('Mahasiswa already exists', 409);
                } else {
                    this.mahasiswaRepository
                        .createQueryBuilder()
                        .insert()
                        .into(MahasiswaEntity)
                        .values({
                            is_active: true,
                            nim: body.nim,
                            nama: body.nama,
                            program_studi: body.program_studi,
                            foto: body.Foto,
                        })
                        .execute();
                    return { message: 'Mahasiswa created successfully' };
                }
            });
    }

    async update(body: CreateMahasiswa, nim: string) {
        return this.mahasiswaRepository
            .findOne({ where: { nim: nim } })
            .then(async (mahasiswa) => {
                if (mahasiswa) {
                    const existingMahasiswa = await this.mahasiswaRepository.findOne({
                        where: { nim: body.nim },
                    });
                    if (existingMahasiswa && existingMahasiswa.nim !== nim) {
                        throw new HttpException(
                            'Another mahasiswa with the same name already exists',
                            409,
                        );
                    } else {
                        await this.mahasiswaRepository
                            .createQueryBuilder()
                            .update(MahasiswaEntity)
                            .set({
                                nim: body.nim,
                                nama: body.nama,
                                program_studi: body.program_studi,
                                foto: body.Foto,
                            })
                            .where('nim = :nim', { nim: nim })
                            .execute();
                        return { message: 'Mahasiswa updated successfully' };
                    }
                } else {
                    throw new HttpException('Mahasiswa not found', 404);
                }
            });
    }

    async active(nim: string) {
        return this.mahasiswaRepository
            .findOne({ where: { nim: nim } })
            .then((mahasiswa) => {
                if (mahasiswa) {
                    this.mahasiswaRepository
                        .createQueryBuilder()
                        .update(MahasiswaEntity)
                        .set({
                            is_active: true,
                        })
                        .where('nim = :nim', { nim: nim })
                        .execute();
                    return { message: 'Mahasiswa activated successfully' };
                } else {
                    throw new HttpException('Mahasiswa not found', 404);
                }
            });
    }

    async deactive(nim: string) {
        return this.mahasiswaRepository
            .findOne({ where: { nim: nim } })
            .then((mahasiswa) => {
                if (mahasiswa) {
                    this.mahasiswaRepository
                        .createQueryBuilder()
                        .update(MahasiswaEntity)
                        .set({
                            is_active: false,
                        })
                        .where('nim = :nim', { nim: nim })
                        .execute();
                    return { message: 'Mahasiswa deactivated successfully' };
                } else {
                    throw new HttpException('Mahasiswa not found', 404);
                }
            });
    }

    async all(query: MahasiswaDTO) {
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
                const result = await this.mahasiswaRepository
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
                const result = await this.mahasiswaRepository
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
        } catch (error) {
            console.log(error)
        }
    }

    async findOne(nim: string) {
        return this.mahasiswaRepository
            .findOne({ where: { nim: nim } })
            .then((mahasiswa) => {
                if (mahasiswa) {
                    let statusCode = 200;
                    return { statusCode, data: mahasiswa };
                } else {
                    throw new HttpException('Data not found', 404);
                }
            });
    }
}