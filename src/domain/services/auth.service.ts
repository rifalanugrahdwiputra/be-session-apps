import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
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
}
