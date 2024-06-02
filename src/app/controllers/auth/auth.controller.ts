import { Body, Controller, HttpCode, HttpException, Post, UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from 'src/app/middlewares/guard/local-auth.guard';
import { AuthService } from 'src/domain/services/auth.service';
import { HttpExceptionFilter } from 'src/app/statics/filters/exceptions.filter';
import { Login } from 'src/infra/models/auth.model';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @UseGuards(LocalAuthGuard)
    @HttpCode(201)
    @UseFilters(new HttpExceptionFilter())
    @UsePipes(new ValidationPipe({ transform: true }))
    @ApiOperation({ summary: 'Endpoint for Login User.' })

    async login(@Body() loginBody: Login) {
        try {
            return await this.authService.login(loginBody);
        } catch (error) {
            throw new HttpException(error.message, error.status || 500);
        }
    }
}
