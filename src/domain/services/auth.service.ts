import { HttpException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { Login } from 'src/infra/models/auth.model';
import * as crypto from 'crypto';
import { LogTwEntity } from '../entities/log_tw.entity';
import { UsersModelCreate } from 'src/infra/models/users.model';
import { Request } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @Inject('AUTH_REPOSITORY')
        private authRepository: Repository<UserEntity>,
        @Inject('LOG_TW_REPOSITORY')
        private logTwRepository: Repository<LogTwEntity>,
    ) { }

    async validateUser(username: string, password: string): Promise<any> {
        const hashedPassword = crypto.createHash('md5').update(password).digest('hex');
        const user = await this.authRepository.findOne({ where: { username: username, password: hashedPassword } });
        return user;
    }

    async login(body: Login, request: Request) {
        const user = await this.validateUser(body.username, body.password);
        if (!user) {
            await this.logTwRepository
                .createQueryBuilder()
                .insert()
                .into(LogTwEntity)
                .values({
                    user: body.username,
                    ipaddress: request.ip,
                    information: `${body.username} gagal login`,
                })
                .execute();
            throw new UnauthorizedException();
        }
        await this.logTwRepository
            .createQueryBuilder()
            .insert()
            .into(LogTwEntity)
            .values({
                user: body.username,
                ipaddress: request.ip,
                information: `${body.username} berhasil login`,
            })
            .execute();

        const payload = { usersId: user.id };

        return {
            statusCode: 200,
            data: {
                user,
                access_token: this.jwtService.sign(payload),
            }
        };
    }


    async register(body: UsersModelCreate, request: Request) {
        try {
            const existingEmail = await this.authRepository.findOne({
                where: { email: body.email },
            });
            const existingUsername = await this.authRepository.findOne({
                where: { username: body.username },
            });

            if (existingEmail && existingEmail.is_active) {
                await this.logTwRepository
                    .createQueryBuilder()
                    .insert()
                    .into(LogTwEntity)
                    .values({
                        user: body.email,
                        ipaddress: request.ip,
                        information: `${body.email} telah digunakan dan gagal register`,
                    })
                    .execute();
                throw new HttpException('Email already exists', 409);
            } else if (existingUsername) {
                await this.logTwRepository
                    .createQueryBuilder()
                    .insert()
                    .into(LogTwEntity)
                    .values({
                        user: body.username,
                        ipaddress: request.ip,
                        information: `${body.username} telah digunakan dan gagal register`,
                    })
                    .execute();
                throw new HttpException('Username already exists', 409);
            } else {
                const hashedPassword = crypto.createHash('md5').update("password").digest('hex');
                const newUser = this.authRepository.create({
                    username: body.username,
                    email: body.email,
                    password: hashedPassword,
                    alamat: body.alamat,
                    telp: body.telp,
                    is_active: true,
                });
                await this.authRepository.save(newUser);
                await this.logTwRepository
                    .createQueryBuilder()
                    .insert()
                    .into(LogTwEntity)
                    .values({
                        user: body.email,
                        ipaddress: request.ip,
                        information: `${body.email} berhasil register`,
                    })
                    .execute();
                return { message: 'User registered successfully' };
            }
        }
        catch (e) { }
    }
}
