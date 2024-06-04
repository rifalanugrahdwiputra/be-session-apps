import { Body, Controller, HttpCode, HttpException, Post, Req, UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from 'src/app/middlewares/guard/local-auth.guard';
import { AuthService } from 'src/domain/services/auth.service';
import { HttpExceptionFilter, error_401, error_403, error_500 } from 'src/app/statics/filters/exceptions.filter';
import { Login } from 'src/infra/models/auth.model';
import { UsersModelCreate } from 'src/infra/models/users.model';
import { Request } from 'express';

@Controller('auth')
@ApiTags('Auth')
@ApiResponse({
    status: 500,
    schema: { type: 'object', properties: error_500 },
})
@ApiResponse({
    status: 401,
    schema: { type: 'object', properties: error_401 },
})
@ApiResponse({
    status: 403,
    schema: { type: 'object', properties: error_403 },
})
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @UseGuards(LocalAuthGuard)
    @HttpCode(201)
    @UseFilters(new HttpExceptionFilter())
    @UsePipes(new ValidationPipe({ transform: true }))
    @ApiOperation({ summary: 'Endpoint for Login User.' })

    async login(@Body() loginBody: Login, @Req() request: Request) {
        try {
            return await this.authService.login(loginBody, request);
        } catch (error) {
            throw new HttpException(error.message, error.status || 500);
        }
    }

    @Post('register')
    @HttpCode(201)
    @UseFilters(new HttpExceptionFilter())
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(@Body() body: UsersModelCreate, @Req() request: Request): Promise<{ message: string }> {
        try {
            return await this.authService.register(body, request);
        } catch (error) {
            throw new HttpException(error.message, error.status || 500);
        }
    }
}
