import { HttpException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { Login } from 'src/infra/models/auth.model';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @Inject('AUTH_REPOSITORY')
        private authRepository: Repository<UserEntity>,
    ) { }

    async validateUser(username: string, password: string): Promise<any> {
        const hashedPassword = crypto.createHash('md5').update(password).digest('hex');
        const user = await this.authRepository.findOne({ where: { username: username, password: hashedPassword } });
        return user;
    }

    async login(body: Login) {
        const user = await this.validateUser(body.username, body.password);
        console.log(user);
        if (!user) {
            throw new UnauthorizedException();
        }
        const payload = { username: user.username, sub: user.id };
        return {
            statusCode: 200,
            data: {
                username: user.username,
                access_token: this.jwtService.sign(payload),
            }
        };
    }

    async register(body: Login) {
        const existingUsername = await this.authRepository.findOne({
            where: { username: body.username },
        });
        if (existingUsername && existingUsername.is_active) {
            throw new HttpException('Username already exists', 409);
        } else if (existingUsername && !existingUsername.is_active) {
            await this.authRepository
                .createQueryBuilder()
                .update(UserEntity)
                .set({
                    is_active: true,
                })
                .where('id = :id', { id: existingUsername.id })
                .execute();
            return { message: 'Users registered successfully' };
        }
        return await this.authRepository
            .findOne({ where: { username: body.username } })
            .then((users) => {
                if (users) {
                    throw new HttpException('Users already exists', 409);
                } else {
                    const hashedPassword = crypto.createHash('md5').update(body.password).digest('hex');
                    this.authRepository
                        .createQueryBuilder()
                        .insert()
                        .into(UserEntity)
                        .values({
                            is_active: true,
                            username: body.username,
                            password: hashedPassword,
                        })
                        .execute();
                    return { message: 'Users registered successfully' };
                }
            });
    }
}
