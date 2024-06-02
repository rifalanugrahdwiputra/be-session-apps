import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SkripsiEntity } from '../entities/skripsi.entity';
import { CreateSkripsi } from 'src/infra/models/skripsi.model';
import { SkripsiDTO } from 'src/app/dtos/skripsi.dto';

@Injectable()
export class SkripsiService {
    constructor(
        @Inject('SKRIPSI_REPOSITORY')
        private skripsiRepository: Repository<SkripsiEntity>,
    ) { }

    async create(body: CreateSkripsi) {
        const existingSkripsi = await this.skripsiRepository.findOne({
            where: { id: body.id },
        });
        if (existingSkripsi && existingSkripsi.is_active) {
            throw new HttpException('Skripsi already exists', 409);
        } else if (existingSkripsi && !existingSkripsi.is_active) {
            await this.skripsiRepository
                .createQueryBuilder()
                .update(SkripsiEntity)
                .set({
                    is_active: true,
                })
                .where('id = :id', { id: existingSkripsi.id })
                .execute();
            return { message: 'Skripsi created successfully' };
        }
        return await this.skripsiRepository
            .findOne({ where: { id: body.id } })
            .then((skripsi) => {
                if (skripsi) {
                    throw new HttpException('Skripsi already exists', 409);
                } else {
                    this.skripsiRepository
                        .createQueryBuilder()
                        .insert()
                        .into(SkripsiEntity)
                        .values({
                            is_active: true,
                            id: body.id,
                            nim: body.nim,
                            pembimbing: body.pembimbing,
                            penguji1: body.penguji1,
                            penguji2: body.penguji2,
                            tanggal_daftar: body.tanggal_daftar,
                            tanggal_sidang: body.tanggal_sidang,
                            ruang_sidang: body.ruang_sidang,
                            nilai_pembimbing: body.nilai_pembimbing,
                            nilai_penguji1: body.nilai_penguji1,
                            nilai_penguji2: body.nilai_penguji2,
                            nilai_akhir: body.nilai_akhir,
                            keterangan: body.keterangan,
                        })
                        .execute();
                    return { message: 'Skripsi created successfully' };
                }
            });
    }

    async update(body: CreateSkripsi, id: Number) {
        return this.skripsiRepository
            .findOne({ where: { id: id } })
            .then(async (skripsi) => {
                if (skripsi) {
                    const existingSkripsi = await this.skripsiRepository.findOne({
                        where: { id: body.id },
                    });
                    if (existingSkripsi && existingSkripsi.id !== id) {
                        throw new HttpException(
                            'Another skripsi with the same name already exists',
                            409,
                        );
                    } else {
                        await this.skripsiRepository
                            .createQueryBuilder()
                            .update(SkripsiEntity)
                            .set({
                                id: body.id,
                                nim: body.nim,
                                pembimbing: body.pembimbing,
                                penguji1: body.penguji1,
                                penguji2: body.penguji2,
                                tanggal_daftar: body.tanggal_daftar,
                                tanggal_sidang: body.tanggal_sidang,
                                ruang_sidang: body.ruang_sidang,
                                nilai_pembimbing: body.nilai_pembimbing,
                                nilai_penguji1: body.nilai_penguji1,
                                nilai_penguji2: body.nilai_penguji2,
                                nilai_akhir: body.nilai_akhir,
                                keterangan: body.keterangan,
                            })
                            .where('id = :id', { id: id })
                            .execute();
                        return { message: 'Skripsi updated successfully' };
                    }
                } else {
                    throw new HttpException('Skripsi not found', 404);
                }
            });
    }

    async active(id: Number) {
        return this.skripsiRepository
            .findOne({ where: { id: id } })
            .then((skripsi) => {
                if (skripsi) {
                    this.skripsiRepository
                        .createQueryBuilder()
                        .update(SkripsiEntity)
                        .set({
                            is_active: true,
                        })
                        .where('id = :id', { id: id })
                        .execute();
                    return { message: 'Skripsi activated successfully' };
                } else {
                    throw new HttpException('Skripsi not found', 404);
                }
            });
    }

    async deactive(id: Number) {
        return this.skripsiRepository
            .findOne({ where: { id: id } })
            .then((skripsi) => {
                if (skripsi) {
                    this.skripsiRepository
                        .createQueryBuilder()
                        .update(SkripsiEntity)
                        .set({
                            is_active: false,
                        })
                        .where('id = :id', { id: id })
                        .execute();
                    return { message: 'Skripsi deactivated successfully' };
                } else {
                    throw new HttpException('Dosen not found', 404);
                }
            });
    }

    async all(query: SkripsiDTO) {
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
            if (query.nim) {
                const result = await this.skripsiRepository
                    .createQueryBuilder()
                    .select()
                    .where('nim LIKE :nim', {
                        nim: `%${query.nim}%`,
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
                const result = await this.skripsiRepository
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

    async findOne(id: Number) {
        try {
            return this.skripsiRepository
                .findOne({ where: { id: id } })
                .then((skripsi) => {
                    if (skripsi) {
                        let statusCode = 200;
                        return { statusCode, data: skripsi };
                    } else {
                        throw new HttpException('Data not found', 404);
                    }
                });
        }
        catch (e) {
            console.log(e);
        }
    }

    async deleteByid(id: Number) {
        const skripsi = await this.skripsiRepository.findOne({ where: { id: id } });
        if (!skripsi) {
            throw new HttpException('Skripsi not found', 404);
        }
        await this.skripsiRepository.delete({ id: id });
        return { message: 'Skripsi deleted successfully' };
    }
}
