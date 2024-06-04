import { HttpException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SkripsiEntity } from '../entities/skripsi.entity';
import { CreateSkripsi } from 'src/infra/models/skripsi.model';
import { SkripsiDTO } from 'src/app/dtos/skripsi.dto';
import { LogTwEntity } from '../entities/log_tw.entity';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';

@Injectable()
export class SkripsiService {
    constructor(
        @Inject('SKRIPSI_REPOSITORY')
        private skripsiRepository: Repository<SkripsiEntity>,
        @Inject('LOG_TW_REPOSITORY')
        private logTwRepository: Repository<LogTwEntity>,
        private jwtService: JwtService,
    ) { }

    async create(body: CreateSkripsi, request: Request) {
        const token = this.extractTokenFromHeader(request.headers.authorization);
        if (!token) {
            throw new UnauthorizedException('Token not provided');
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });
            const existingSkripsi = await this.skripsiRepository.findOne({
                where: { id: body.id },
            });
            if (existingSkripsi && existingSkripsi.is_active) {
                await this.logTwRepository
                    .createQueryBuilder()
                    .insert()
                    .into(LogTwEntity)
                    .values({
                        user: payload.username,
                        ipaddress: payload.ip,
                        information: `${payload.username} skripsi sudah ada dan gagal menambahkan`,
                    })
                    .execute();
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
                await this.logTwRepository
                    .createQueryBuilder()
                    .insert()
                    .into(LogTwEntity)
                    .values({
                        user: payload.username,
                        ipaddress: payload.ip,
                        information: `${payload.username} skripsi berhasil di tambahkan`,
                    })
                    .execute();
                return { message: 'Skripsi created successfully' };
            }
            return await this.skripsiRepository
                .findOne({ where: { id: body.id } })
                .then((skripsi) => {
                    if (skripsi) {
                        this.logTwRepository
                            .createQueryBuilder()
                            .insert()
                            .into(LogTwEntity)
                            .values({
                                user: payload.username,
                                ipaddress: payload.ip,
                                information: `${payload.username} skripsi sudah ada dan gagal menambahkan`,
                            })
                            .execute();
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
                        this.logTwRepository
                            .createQueryBuilder()
                            .insert()
                            .into(LogTwEntity)
                            .values({
                                user: payload.username,
                                ipaddress: payload.ip,
                                information: `${payload.username} skripsi berhasil ditambahkan`,
                            })
                            .execute();
                        return { message: 'Skripsi created successfully' };
                    }
                });
        }
        catch (error) {
            console.log(error);
        }
    }

    async update(body: CreateSkripsi, id: Number, request: Request) {
        const token = this.extractTokenFromHeader(request.headers.authorization);
        if (!token) {
            throw new UnauthorizedException('Token not provided');
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });
            return this.skripsiRepository
                .findOne({ where: { id: id } })
                .then(async (skripsi) => {
                    if (skripsi) {
                        const existingSkripsi = await this.skripsiRepository.findOne({
                            where: { id: body.id },
                        });
                        if (existingSkripsi && existingSkripsi.id !== id) {
                            await this.logTwRepository
                                .createQueryBuilder()
                                .insert()
                                .into(LogTwEntity)
                                .values({
                                    user: payload.username,
                                    ipaddress: payload.ip,
                                    information: `${payload.username} skripsi sudah ada dan gagal update`,
                                })
                                .execute();
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
                                .execute(); await this.logTwRepository
                                    .createQueryBuilder()
                                    .insert()
                                    .into(LogTwEntity)
                                    .values({
                                        user: payload.username,
                                        ipaddress: payload.ip,
                                        information: `${payload.username} skripsi berhasil di update`,
                                    })
                                    .execute();

                            return { message: 'Skripsi updated successfully' };
                        }
                    } else {
                        await this.logTwRepository
                            .createQueryBuilder()
                            .insert()
                            .into(LogTwEntity)
                            .values({
                                user: payload.username,
                                ipaddress: payload.ip,
                                information: `${payload.username} skripsi tidak ditemukan`,
                            })
                            .execute();
                        throw new HttpException('Skripsi not found', 404);
                    }
                });
        }
        catch (error) {
            console.log(error);
        }
    }

    async active(id: Number, request: Request) {
        const token = this.extractTokenFromHeader(request.headers.authorization);
        if (!token) {
            throw new UnauthorizedException('Token not provided');
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });
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
                        this.logTwRepository
                            .createQueryBuilder()
                            .insert()
                            .into(LogTwEntity)
                            .values({
                                user: payload.username,
                                ipaddress: payload.ip,
                                information: `${payload.username} skripsi activated successfully`,
                            })
                            .execute();
                        return { message: 'Skripsi activated successfully' };
                    } else {
                        this.logTwRepository
                            .createQueryBuilder()
                            .insert()
                            .into(LogTwEntity)
                            .values({
                                user: payload.username,
                                ipaddress: payload.ip,
                                information: `${payload.username} skripsi tidak ditemukan`,
                            })
                            .execute();
                        throw new HttpException('Skripsi not found', 404);
                    }
                });
        }
        catch (error) {
            console.log(error);
        }
    }

    async deactive(id: Number, request: Request) {
        const token = this.extractTokenFromHeader(request.headers.authorization);
        if (!token) {
            throw new UnauthorizedException('Token not provided');
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });
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
                        this.logTwRepository
                            .createQueryBuilder()
                            .insert()
                            .into(LogTwEntity)
                            .values({
                                user: payload.username,
                                ipaddress: payload.ip,
                                information: `${payload.username} skripsi deactivated successfully`,
                            })
                            .execute();
                        return { message: 'Skripsi deactivated successfully' };
                    } else {
                        this.logTwRepository
                            .createQueryBuilder()
                            .insert()
                            .into(LogTwEntity)
                            .values({
                                user: payload.username,
                                ipaddress: payload.ip,
                                information: `${payload.username} skripsi tidak ditemukan`,
                            })
                            .execute();
                        throw new HttpException('Skripsi not found', 404);
                    }
                });
        }
        catch (error) {
            console.log(error);
        }
    }

    async all(query: SkripsiDTO, request: Request) {
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
                        information: `${payload.username} berhasil melihat list skripsi`,
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
        catch (error) {
            console.log(error);
        }
    }

    async findOne(id: Number, request: Request) {
        const token = this.extractTokenFromHeader(request.headers.authorization);
        if (!token) {
            throw new UnauthorizedException('Token not provided');
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });
            try {
                return this.skripsiRepository
                    .findOne({ where: { id: id } })
                    .then((skripsi) => {
                        if (skripsi) {
                            this.logTwRepository
                                .createQueryBuilder()
                                .insert()
                                .into(LogTwEntity)
                                .values({
                                    user: payload.username,
                                    ipaddress: payload.ip,
                                    information: `${payload.username} melihat detail skripsi`,
                                })
                                .execute();
                            let statusCode = 200;
                            return { statusCode, data: skripsi };
                        } else {
                            this.logTwRepository
                                .createQueryBuilder()
                                .insert()
                                .into(LogTwEntity)
                                .values({
                                    user: payload.username,
                                    ipaddress: payload.ip,
                                    information: `${payload.username} skripsi tidak ditemukan`,
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

    async deleteByid(id: Number, request: Request) {
        const token = this.extractTokenFromHeader(request.headers.authorization);
        if (!token) {
            throw new UnauthorizedException('Token not provided');
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });
            const skripsi = await this.skripsiRepository.findOne({ where: { id: id } });
            if (!skripsi) {
                await this.logTwRepository
                    .createQueryBuilder()
                    .insert()
                    .into(LogTwEntity)
                    .values({
                        user: payload.username,
                        ipaddress: payload.ip,
                        information: `${payload.username} skripsi tidak ditemukan`,
                    })
                    .execute();
                throw new HttpException('Skripsi not found', 404);
            }
            await this.skripsiRepository.delete({ id: id });
            await this.logTwRepository
                .createQueryBuilder()
                .insert()
                .into(LogTwEntity)
                .values({
                    user: payload.username,
                    ipaddress: payload.ip,
                    information: `${payload.username} skripsi berhasil di delete`,
                })
                .execute();
            return { message: 'Skripsi deleted successfully' };
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
