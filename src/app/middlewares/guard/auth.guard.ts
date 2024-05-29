import {
  BadGatewayException,
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { config as dotenvConfig } from 'dotenv';


const ENV = process.env.NODE_ENV || 'dev';
dotenvConfig({ path: ENV === 'dev' ? 'config/.dev.env' : ENV == 'uat' ? 'config/.uat.env' : 'config/.prod.env' });
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      request['user'] = payload;
      if (!this.validateExp(payload.exp)) {
        throw new ForbiddenException();
      }
    } catch {
      throw new ForbiddenException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private validateExp(exp: number): boolean {
    return exp * 1000 > Date.now();
  }
}
