import { HttpException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MahasiswaEntity } from '../entities/mahasiswa.entity';
import { CreateMahasiswa } from 'src/infra/models/mahasiswa.model';
import { MahasiswaDTO } from 'src/app/dtos/mahasiswa.dto';
import { LogTwEntity } from '../entities/log_tw.entity';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';

@Injectable()
export class MahasiswaService {
    constructor(
        @Inject('MAHASISWA_REPOSITORY')
        private mahasiswaRepository: Repository<MahasiswaEntity>,
        @Inject('LOG_TW_REPOSITORY')
        private logTwRepository: Repository<LogTwEntity>,
        private jwtService: JwtService,
    ) { }

    async create(body: CreateMahasiswa, request: Request) {
        const token = this.extractTokenFromHeader(request.headers.authorization);
        if (!token) {
            throw new UnauthorizedException('Token not provided');
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });
            const existingMahasiswa = await this.mahasiswaRepository.findOne({
                where: { nim: body.nim },
            });
            if (existingMahasiswa && existingMahasiswa.is_active) {
                await this.logTwRepository
                    .createQueryBuilder()
                    .insert()
                    .into(LogTwEntity)
                    .values({
                        user: payload.username,
                        ipaddress: payload.ip,
                        information: `${payload.username} mahasiswa sudah ada dan gagal menambahkan`,
                    })
                    .execute();
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
                await this.logTwRepository
                    .createQueryBuilder()
                    .insert()
                    .into(LogTwEntity)
                    .values({
                        user: payload.username,
                        ipaddress: payload.ip,
                        information: `${payload.username} mahasiswa berhasil di tambahkan`,
                    })
                    .execute();
                return { message: 'Mahasiswa created successfully' };
            }
            return await this.mahasiswaRepository
                .findOne({ where: { nim: body.nim } })
                .then((mahasiswa) => {
                    if (mahasiswa) {
                        this.logTwRepository
                            .createQueryBuilder()
                            .insert()
                            .into(LogTwEntity)
                            .values({
                                user: payload.username,
                                ipaddress: payload.ip,
                                information: `${payload.username} mahasiswa sudah ada dan gagal menambahkan`,
                            })
                            .execute();
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
                        this.logTwRepository
                            .createQueryBuilder()
                            .insert()
                            .into(LogTwEntity)
                            .values({
                                user: payload.username,
                                ipaddress: payload.ip,
                                information: `${payload.username} mahasiswa berhasil ditambahkan`,
                            })
                            .execute();
                        return { message: 'Mahasiswa created successfully' };
                    }
                });
        }
        catch (error) { }
    }

    async update(body: CreateMahasiswa, nim: string, request: Request) {
        const token = this.extractTokenFromHeader(request.headers.authorization);
        if (!token) {
            throw new UnauthorizedException('Token not provided');
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });

            // Retrieve the mahasiswa being updated
            const mahasiswa = await this.mahasiswaRepository.findOne({ where: { nim: nim } });
            if (!mahasiswa) {
                await this.logTwRepository
                    .createQueryBuilder()
                    .insert()
                    .into(LogTwEntity)
                    .values({
                        user: payload.username,
                        ipaddress: payload.ip,
                        information: `${payload.username} mahasiswa tidak ditemukan`,
                    })
                    .execute();
                throw new HttpException('Mahasiswa not found', 404);
            }

            // Check if the new nim exists and belongs to a different mahasiswa
            if (body.nim !== nim) {
                const anotherMahasiswa = await this.mahasiswaRepository.findOne({ where: { nim: body.nim } });
                if (anotherMahasiswa) {
                    await this.logTwRepository
                        .createQueryBuilder()
                        .insert()
                        .into(LogTwEntity)
                        .values({
                            user: payload.username,
                            ipaddress: payload.ip,
                            information: `${payload.username} mahasiswa sudah ada dan gagal update`,
                        })
                        .execute();
                    throw new HttpException('Another mahasiswa with the same nim already exists', 409);
                }
            }

            // Only update fields that are different
            const updatedFields = {};
            if (mahasiswa.nim !== body.nim) {
                updatedFields['nim'] = body.nim;
            }
            if (mahasiswa.nama !== body.nama) {
                updatedFields['nama'] = body.nama;
            }
            if (mahasiswa.program_studi !== body.program_studi) {
                updatedFields['program_studi'] = body.program_studi;
            }
            if (mahasiswa.foto !== body.Foto) {
                updatedFields['foto'] = body.Foto;
            }

            if (Object.keys(updatedFields).length > 0) {
                await this.mahasiswaRepository
                    .createQueryBuilder()
                    .update(MahasiswaEntity)
                    .set(updatedFields)
                    .where('nim = :nim', { nim: nim })
                    .execute();

                await this.logTwRepository
                    .createQueryBuilder()
                    .insert()
                    .into(LogTwEntity)
                    .values({
                        user: payload.username,
                        ipaddress: payload.ip,
                        information: `${payload.username} mahasiswa berhasil di update`,
                    })
                    .execute();
                return { message: 'Mahasiswa updated successfully' };
            } else {
                await this.logTwRepository
                    .createQueryBuilder()
                    .insert()
                    .into(LogTwEntity)
                    .values({
                        user: payload.username,
                        ipaddress: payload.ip,
                        information: `${payload.username} tidak ada perubahan pada mahasiswa`,
                    })
                    .execute();
                return { message: 'No changes detected, mahasiswa not updated' };
            }
        } catch (error) {
            console.log(error);
            throw new HttpException('An error occurred', 500);
        }
    }


    async active(nim: string, request: Request) {
        const token = this.extractTokenFromHeader(request.headers.authorization);
        if (!token) {
            throw new UnauthorizedException('Token not provided');
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });
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
                        this.logTwRepository
                            .createQueryBuilder()
                            .insert()
                            .into(LogTwEntity)
                            .values({
                                user: payload.username,
                                ipaddress: payload.ip,
                                information: `${payload.username} mahasiswa activated successfully`,
                            })
                            .execute();
                        return { message: 'Mahasiswa activated successfully' };
                    } else {
                        this.logTwRepository
                            .createQueryBuilder()
                            .insert()
                            .into(LogTwEntity)
                            .values({
                                user: payload.username,
                                ipaddress: payload.ip,
                                information: `${payload.username} mahasiswa tidak ditemukan`,
                            })
                            .execute();
                        throw new HttpException('Mahasiswa not found', 404);
                    }
                });
        }
        catch (error) { }
    }

    async deactive(nim: string, request: Request) {
        const token = this.extractTokenFromHeader(request.headers.authorization);
        if (!token) {
            throw new UnauthorizedException('Token not provided');
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });
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
                        this.logTwRepository
                            .createQueryBuilder()
                            .insert()
                            .into(LogTwEntity)
                            .values({
                                user: payload.username,
                                ipaddress: payload.ip,
                                information: `${payload.username} mahasiswa deactivated successfully`,
                            })
                            .execute();
                        return { message: 'Mahasiswa deactivated successfully' };
                    } else {
                        this.logTwRepository
                            .createQueryBuilder()
                            .insert()
                            .into(LogTwEntity)
                            .values({
                                user: payload.username,
                                ipaddress: payload.ip,
                                information: `${payload.username} mahasiswa tidak ditemukan`,
                            })
                            .execute();
                        throw new HttpException('Mahasiswa not found', 404);
                    }
                });
        }
        catch (error) { }
    }

    async all(query: MahasiswaDTO, request: Request) {
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
                        information: `${payload.username} berhasil melihat list mahasiswa`,
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
            } catch (error) { }
        }
        catch (error) { }
    }

    async findOne(nim: string, request: Request) {
        const token = this.extractTokenFromHeader(request.headers.authorization);
        if (!token) {
            throw new UnauthorizedException('Token not provided');
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });
            return this.mahasiswaRepository
                .findOne({ where: { nim: nim } })
                .then((mahasiswa) => {
                    if (mahasiswa) {
                        this.logTwRepository
                            .createQueryBuilder()
                            .insert()
                            .into(LogTwEntity)
                            .values({
                                user: payload.username,
                                ipaddress: payload.ip,
                                information: `${payload.username} melihat detail mahasiswa`,
                            })
                            .execute();
                        let statusCode = 200;
                        return { statusCode, data: mahasiswa };
                    } else {
                        this.logTwRepository
                            .createQueryBuilder()
                            .insert()
                            .into(LogTwEntity)
                            .values({
                                user: payload.username,
                                ipaddress: payload.ip,
                                information: `${payload.username} mahasiswa tidak ditemukan`,
                            })
                            .execute();
                        throw new HttpException('Data not found', 404);
                    }
                });
        }
        catch (error) {
            console.log(error);
        }
    }

    private extractTokenFromHeader(authHeader: string | undefined): string | undefined {
        const [type, token] = authHeader?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    async deleteByNim(nim: string) {
        const mahasiswa = await this.mahasiswaRepository.findOne({ where: { nim: nim } });
        if (!mahasiswa) {
            throw new HttpException('Mahasiswa not found', 404);
        }
        await this.mahasiswaRepository.delete({ nim: nim });
        return { message: 'Mahasiswa deleted successfully' };
    }
}